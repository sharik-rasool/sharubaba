import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { checkKeywordDuplicate, checkCannibalization, slugify } from "@/services/cannibalization-checker";
import { validateSeo } from "@/services/seo-validator";

const statusFilePath = path.join(process.cwd(), "scripts", "automation-status.json");
const logFilePath = path.join(process.cwd(), "scripts", "automation.log");

// Groq pricing estimates (currently free developer plan)

interface AutomationStatusInfo {
    status: string;
    pid?: number;
    progress?: { current: number; total: number };
    currentKeyword?: string;
    endedAt?: string;
    error?: string;
    startedAt?: string;
    dryRun?: boolean;
}

function readStatusFile(): AutomationStatusInfo {
    if (!fs.existsSync(statusFilePath)) {
        return { status: "idle", progress: { current: 0, total: 0 }, currentKeyword: "" };
    }
    try {
        return JSON.parse(fs.readFileSync(statusFilePath, "utf8")) as AutomationStatusInfo;
    } catch {
        return { status: "idle", progress: { current: 0, total: 0 }, currentKeyword: "" };
    }
}

function updateStatusFile(update: Partial<AutomationStatusInfo>) {
    try {
        let currentStatus: AutomationStatusInfo = { status: "idle" };
        if (fs.existsSync(statusFilePath)) {
            try {
                currentStatus = JSON.parse(fs.readFileSync(statusFilePath, "utf8")) as AutomationStatusInfo;
            } catch {
                currentStatus = { status: "idle" };
            }
        }
        const newStatus = { ...currentStatus, ...update };
        const dir = path.dirname(statusFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(statusFilePath, JSON.stringify(newStatus, null, 2), "utf8");
    } catch (err) {
        console.error("Failed to write status file:", err);
    }
}

// Check process status (detect zombie status)
function isProcessRunning(pid: number): boolean {
    if (!pid) return false;
    try {
        process.kill(pid, 0); // signal 0 checks for existence without killing
        return true;
    } catch {
        return false;
    }
}

// Helpers for CSV and Sheet URL rewriting
function getCsvUrl(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        const gidMatch = url.match(/[#&]gid=([0-9]+)/);
        const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : "";
        return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv${gidParam}`;
    }
    return url;
}

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(v => v.replace(/^"|"$/g, '').trim());
}

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = readStatusFile();
    
    // Check if the process is marked as running but is actually dead (zombie protection)
    if (status.status === "running" && status.pid && !isProcessRunning(status.pid)) {
        status.status = "failed";
        status.error = "Process was terminated unexpectedly.";
        status.endedAt = new Date().toISOString();
        updateStatusFile(status);
    }

    // Read last 150 lines of logs if they exist
    let logs = "";
    if (fs.existsSync(logFilePath)) {
        try {
            const rawLogs = fs.readFileSync(logFilePath, "utf8");
            const lines = rawLogs.split("\n");
            logs = lines.slice(-150).join("\n");
        } catch {
            logs = "Failed to read log file.";
        }
    }

    return NextResponse.json({ status, logs });
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action, sheetUrl, dryRun, content, seoTitle, seoDescription, primaryKeyword, limit } = body;

        // Action 0: On-Demand SEO QA Validation
        if (action === "validate") {
            await connectDB();
            const blogs = await Blog.find({}).select("slug").lean<{ slug: string }[]>();
            const validSlugs = blogs.map(b => b.slug);
            const qaReport = validateSeo(content || "", seoTitle || "", seoDescription || "", primaryKeyword || "", validSlugs);
            return NextResponse.json({ success: true, qaReport });
        }

        // Action 1: Cost Estimation & Cannibalization Precheck
        if (action === "estimate") {
            const url = sheetUrl || process.env.GOOGLE_KEYWORDS_SHEET_URL || "";
            if (!url) {
                return NextResponse.json({ error: "Google Sheets URL is required for estimation." }, { status: 400 });
            }

            // Fetch and parse sheet keywords
            const csvUrl = getCsvUrl(url);
            const res = await fetch(csvUrl);
            if (!res.ok) {
                return NextResponse.json({ error: `Failed to fetch CSV sheet. Status: ${res.status}` }, { status: 400 });
            }

            const csvText = await res.text();
            const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
            const rawKeywords: string[] = [];
            
            if (lines.length > 0) {
                const firstLine = parseCSVLine(lines[0]);
                let keywordColIdx = 0;
                const headerIdx = firstLine.findIndex(h => 
                    h.toLowerCase().includes("keyword") || h.toLowerCase().includes("title")
                );
                if (headerIdx !== -1) {
                    keywordColIdx = headerIdx;
                    lines.shift();
                }
                for (const line of lines) {
                    const columns = parseCSVLine(line);
                    const keyword = columns[keywordColIdx];
                    const status = columns[1] ? columns[1].trim() : "";
                    
                    if (keyword && status === "") {
                        rawKeywords.push(keyword);
                    }
                }
            }

            const uniqueRawKeywords = Array.from(new Set(rawKeywords.map(k => k.trim()).filter(k => k.length > 0)));
            if (uniqueRawKeywords.length === 0) {
                return NextResponse.json({ error: "No keywords found in the Google Sheet." }, { status: 400 });
            }

            // Connect to DB and load existing blog items
            await connectDB();
            const existingPosts = await Blog.find({}).select("title slug primaryKeyword").lean<{ title: string; slug: string; primaryKeyword?: string }[]>();

            // Scan keywords
            const targetCount = limit ? parseInt(limit, 10) : (dryRun ? 1 : 1);
            const selectedKeywords: string[] = [];
            const cannibalizationDetails: Array<{
                keyword: string;
                status: "selected" | "duplicate" | "batch_duplicate" | "overlap" | "cannibalized";
                matchedWith?: string;
                reason?: string;
                similarityScore?: number;
            }> = [];

            for (const kw of uniqueRawKeywords) {
                if (selectedKeywords.length >= targetCount) {
                    break;
                }

                // literal check
                const literalCheck = checkKeywordDuplicate(kw, existingPosts);
                if (literalCheck.isDuplicate) {
                    cannibalizationDetails.push({ keyword: kw, status: "duplicate", matchedWith: literalCheck.matchedWith });
                    continue;
                }

                // list duplicate check
                if (selectedKeywords.some(sk => sk.toLowerCase() === kw.toLowerCase() || slugify(sk) === slugify(kw))) {
                    cannibalizationDetails.push({ keyword: kw, status: "batch_duplicate" });
                    continue;
                }

                // semantic cannibalization
                const cannibalResult = await checkCannibalization(kw, existingPosts);
                if (cannibalResult.isCannibal) {
                    cannibalizationDetails.push({ 
                        keyword: kw, 
                        status: "cannibalized", 
                        similarityScore: cannibalResult.similarityScore, 
                        reason: cannibalResult.reason 
                    });
                    continue;
                }

                selectedKeywords.push(kw);
                cannibalizationDetails.push({ keyword: kw, status: "selected", similarityScore: cannibalResult.similarityScore });
            }

            // Calculate cost estimate
            const count = selectedKeywords.length;
            const estFlashInputTokens = count * 20000;
            const estFlashOutputTokens = count * 4000;
            const estProInputTokens = 0;
            const estProOutputTokens = 0;

            const totalEstCost = 0.00; // Free plan on Groq

            return NextResponse.json({
                success: true,
                selectedKeywords,
                allScanned: cannibalizationDetails,
                estimation: {
                    keywordsCount: count,
                    estFlashCalls: count * 8, // total prompt calls per post
                    estProCalls: 0,
                    estFlashInputTokens,
                    estFlashOutputTokens,
                    estProInputTokens,
                    estProOutputTokens,
                    totalEstCost: 0
                }
            });
        }

        // Action 2: Trigger Generation Process
        if (action === "trigger") {
            const currentStatus = readStatusFile();
            if (currentStatus.status === "running" && currentStatus.pid && isProcessRunning(currentStatus.pid)) {
                return NextResponse.json({ error: "Blog automation is already running." }, { status: 400 });
            }

            // Reset log file
            try {
                const dir = path.dirname(logFilePath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(logFilePath, `[${new Date().toISOString()}] Automation started via Admin UI.\n`, "utf8");
            } catch (err) {
                console.error("Failed to reset log file:", err);
            }

            // Build arguments
            const args = ["tsx", "scripts/run-blog-automation.ts"];
            if (dryRun) args.push("--dry-run");
            if (sheetUrl) args.push("--sheet", sheetUrl);
            if (limit) args.push("--limit", String(limit));

            // Open log file handle to pipe output
            const logFileHandle = fs.openSync(logFilePath, "a");

            // Spawn the runner CLI script asynchronously
            const child = spawn("npx", args, {
                cwd: process.cwd(),
                detached: true,
                stdio: ["ignore", logFileHandle, logFileHandle],
                env: { ...process.env }
            });

            // Disconnect parent process reference to allow async execution
            child.unref();

            // Store initial status
            updateStatusFile({
                status: "running",
                startedAt: new Date().toISOString(),
                pid: child.pid,
                progress: { current: 0, total: 0 },
                currentKeyword: "Initializing background runner process...",
                error: "",
                dryRun: !!dryRun
            });

            return NextResponse.json({ success: true, message: "Blog writing pipeline triggered successfully." });
        }

        // Action 3: Cancel Generation Process
        if (action === "cancel") {
            const currentStatus = readStatusFile();
            if (currentStatus.status !== "running" || !currentStatus.pid) {
                return NextResponse.json({ error: "No active automation process to cancel." }, { status: 400 });
            }

            const pid = currentStatus.pid;
            let killed = false;
            
            try {
                // Terminate process tree
                process.kill(pid, "SIGTERM");
                killed = true;
            } catch (err: unknown) {
                console.warn(`Could not kill pid ${pid}: ${(err as Error).message}`);
                // Try SIGKILL if SIGTERM fails
                try {
                    process.kill(pid, "SIGKILL");
                    killed = true;
                } catch (killErr: unknown) {
                    console.error(`SIGKILL failed for pid ${pid}:`, (killErr as Error).message);
                }
            }

            if (killed) {
                updateStatusFile({
                    status: "failed",
                    endedAt: new Date().toISOString(),
                    error: "Process was cancelled by the administrator.",
                    currentKeyword: "Cancelled"
                });
                
                // Append cancellation to logs
                try {
                    fs.appendFileSync(logFilePath, `\n[${new Date().toISOString()}] PROCESS CANCELLED BY ADMIN.\n`, "utf8");
                } catch {}

                return NextResponse.json({ success: true, message: "Blog writing pipeline process terminated." });
            } else {
                return NextResponse.json({ error: "Failed to terminate the background process." }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    } catch (err: unknown) {
        console.error("API /api/automation POST Error:", (err as Error).message || err);
        return NextResponse.json({ error: `Internal Server Error: ${(err as Error).message}` }, { status: 500 });
    }
}
