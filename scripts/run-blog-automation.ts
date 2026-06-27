import mongoose from "mongoose";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { parse } from "node-html-parser";

// Load environment variables from .env.local first, then .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import Blog, { IBlog } from "../src/models/Blog";
import { toolsData } from "../src/lib/tools-data";
import {
    generateContentBrief,
    generateOutline,
    generateSection,
    humanizeSection,
    generateSeoMetadata,
    ContentBrief,
    callGroqWithRetry
} from "../src/services/ai-generator";
import { linkifyHtml, LinkInventoryItem } from "../src/services/internal-linker";
import { validateSeo, QaReport } from "../src/services/seo-validator";
import { checkKeywordDuplicate, checkCannibalization, slugify } from "../src/services/cannibalization-checker";
import { runWithConcurrencyLimit } from "../src/services/concurrency-manager";

// Google Gemini pricing estimates (Gemini 1.5 Flash and Pro)
const PRICE_FLASH_INPUT_PER_M = 0.075;  // $0.075 per 1M tokens
const PRICE_FLASH_OUTPUT_PER_M = 0.30;  // $0.30 per 1M tokens
const PRICE_PRO_INPUT_PER_M = 1.25;     // $1.25 per 1M tokens
const PRICE_PRO_OUTPUT_PER_M = 5.00;    // $5.00 per 1M tokens

const statusFilePath = path.join(process.cwd(), "scripts", "automation-status.json");

// Helper to write progress status JSON
function updateStatus(update: any) {
    try {
        let currentStatus: any = {};
        if (fs.existsSync(statusFilePath)) {
            try {
                currentStatus = JSON.parse(fs.readFileSync(statusFilePath, "utf8"));
            } catch {
                currentStatus = {};
            }
        }
        const newStatus = { ...currentStatus, ...update };
        // Ensure scripts dir exists
        const dir = path.dirname(statusFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(statusFilePath, JSON.stringify(newStatus, null, 2), "utf8");
    } catch (err) {
        console.error("Failed to write status file:", err);
    }
}

// Helper to update Google Sheets status via Apps Script Webhook
async function updateGoogleSheetStatus(keyword: string, status: string, url: string = "", title: string = "") {
    const webhookUrl = process.env.GOOGLE_KEYWORDS_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
        console.log(`[Google Sheet] GOOGLE_KEYWORDS_SHEET_WEBHOOK_URL is not defined in environment. Skipping status update for "${keyword}".`);
        return;
    }

    try {
        console.log(`[Google Sheet] Sending status update for "${keyword}" to Sheet: Status="${status}", Title="${title}", URL="${url}"...`);
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword, status, url, title })
        });
        if (!res.ok) {
            console.warn(`[Google Sheet] Update failed (status ${res.status}).`);
        } else {
            console.log(`[Google Sheet] Update succeeded for "${keyword}".`);
        }
    } catch (err: any) {
        console.error(`[Google Sheet] Error updating sheet for "${keyword}":`, err.message || err);
    }
}

// Helper to sync all live URLs to Google Sheets tab "Live URLs"
async function syncLiveUrlsToGoogleSheet() {
    const webhookUrl = process.env.GOOGLE_KEYWORDS_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
        console.log("[Sync] Webhook URL not set; skipping live URLs sync.");
        return;
    }

    console.log("[Sync] Gathering live URLs for Google Sheets sync...");
    const domain = "https://www.sharikrasool.com";
    const urls: { url: string; category: string }[] = [];

    // 1. Static Pages
    const staticPages = [
        { path: "/", category: "Static Page" },
        { path: "/about", category: "Static Page" },
        { path: "/projects", category: "Static Page" },
        { path: "/contact", category: "Static Page" },
        { path: "/privacy-policy", category: "Static Page" },
        { path: "/terms", category: "Static Page" },
        { path: "/refund-policy", category: "Static Page" },
        { path: "/blog", category: "Static Page" },
        { path: "/tools", category: "Static Page" },
    ];
    staticPages.forEach(p => {
        urls.push({ url: `${domain}${p.path}`, category: p.category });
    });

    // 2. Interactive Tools
    toolsData.forEach(tool => {
        urls.push({ url: `${domain}/tools/${tool.slug}`, category: "Interactive Tool" });
    });

    // 3. Published Blog Posts
    try {
        const now = new Date();
        const publishedPosts = await Blog.find({
            $or: [
                { scheduledFor: { $lte: now } },
                { scheduledFor: { $exists: false } },
                { scheduledFor: null }
            ]
        }).sort({ createdAt: -1 }).lean();

        publishedPosts.forEach(post => {
            urls.push({ url: `${domain}/blog/${post.slug}`, category: "Blog Post" });
        });
    } catch (dbErr: any) {
        console.error("[Sync] Error loading published posts:", dbErr.message || dbErr);
    }

    console.log(`[Sync] Sending ${urls.length} live URLs to Google Sheets...`);
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "live_urls_sync",
                urls: urls,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("[Sync] Sync Succeeded:", result.message || result);
        } else {
            const text = await response.text();
            console.error(`[Sync] Failed. Webhook status ${response.status}:`, text);
        }
    } catch (fetchErr: any) {
        console.error("[Sync] Webhook call error:", fetchErr.message || fetchErr);
    }
}

// Helper to rewrite Google Sheets URLs to direct CSV export URLs
function getCsvUrl(url: string): string {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        const gidMatch = url.match(/[#&]gid=([0-9]+)/);
        const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : "";
        return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv${gidParam}`;
    }
    return url;
}

// Simple robust CSV line parser that respects quotes
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

// Helper to call Groq for meta self-repair
async function selfRepairMetadata(
    content: string,
    brief: ContentBrief,
    issues: string[],
    metaTitle: string,
    metaDescription: string
): Promise<{ seoTitle: string; seoDescription: string; excerpt: string; tags: string[] } | null> {
    console.log(`[SEO QA] Triggering self-repair for metadata. Issues found: ${issues.join(" | ")}`);
    
    const repairPrompt = `You are an SEO QA repair assistant.
We generated an article and metadata, but the metadata failed validation checks.
Validation Issues:
${issues.map(i => `- ${i}`).join("\n")}

Original Metadata Attempt:
Title: "${metaTitle}" (Length: ${metaTitle.length})
Description: "${metaDescription}" (Length: ${metaDescription.length})

Please regenerate optimized SEO metadata matching these strict requirements:
- Meta Title MUST be strictly between 50 and 60 characters.
- Meta Description MUST be strictly between 140 and 160 characters.

Return a JSON object matching this structure exactly (do not output any markdown code blocks or extra text, just raw JSON):
{
  "seoTitle": "Corrected Title (50-60 chars)",
  "seoDescription": "Corrected Description (140-160 chars)",
  "excerpt": "Compelling excerpt (max 120 chars)",
  "tags": ["tag1", "tag2"]
}`;
    
    try {
        const text = await callGroqWithRetry("llama-3.3-70b-versatile", repairPrompt, true);
        return JSON.parse(text);
    } catch (err: any) {
        console.error("[SEO QA] Self-repair failed:", err.message || err);
        return null;
    }
}

async function main() {
    console.log("=========================================");
    console.log("   SEO BLOG WRITING & AUTOLINKING RUNNER  ");
    console.log("=========================================\n");

    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");
    
    let sheetUrlArg = "";
    const sheetIdx = args.indexOf("--sheet");
    if (sheetIdx !== -1 && args[sheetIdx + 1]) {
        sheetUrlArg = args[sheetIdx + 1];
    }

    let limitArg = 1; // Default to 1 for daily generation
    const limitIdx = args.indexOf("--limit");
    if (limitIdx !== -1 && args[limitIdx + 1]) {
        limitArg = parseInt(args[limitIdx + 1], 10) || 1;
    }

    const sheetUrl = sheetUrlArg || process.env.GOOGLE_KEYWORDS_SHEET_URL || "";
    const mongoUri = process.env.MONGODB_URI || "";
    const groqKey = process.env.GROQ_API_KEY || "";

    // Write initial status file
    updateStatus({
        status: "running",
        startedAt: new Date().toISOString(),
        pid: process.pid,
        progress: { current: 0, total: 0 },
        currentKeyword: "Initializing...",
        error: "",
        dryRun
    });

    if (!mongoUri) {
        const err = "CRITICAL: MONGODB_URI is not defined in the environment.";
        console.error(err);
        updateStatus({ status: "failed", error: err, endedAt: new Date().toISOString() });
        process.exit(1);
    }
    if (!groqKey) {
        const err = "CRITICAL: GROQ_API_KEY is not defined in the environment.";
        console.error(err);
        updateStatus({ status: "failed", error: err, endedAt: new Date().toISOString() });
        process.exit(1);
    }

    // Connect to database
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB database.");
    } catch (err: any) {
        const msg = `CRITICAL: MongoDB connection failed: ${err.message || err}`;
        console.error(msg);
        updateStatus({ status: "failed", error: msg, endedAt: new Date().toISOString() });
        process.exit(1);
    }

    // 1. Fetch Keywords list
    let rawKeywords: string[] = [];
    if (sheetUrl) {
        const csvUrl = getCsvUrl(sheetUrl);
        console.log(`Fetching keywords sheet from CSV URL: ${csvUrl}`);
        updateStatus({ currentKeyword: "Fetching keywords Google Sheet..." });
        try {
            const res = await fetch(csvUrl);
            if (!res.ok) {
                throw new Error(`Fetch failed with status ${res.status}`);
            }
            const csvText = await res.text();
            const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
            
            if (lines.length > 0) {
                const firstLine = parseCSVLine(lines[0]);
                let keywordColIdx = 0;
                
                const headerIdx = firstLine.findIndex(h => 
                    h.toLowerCase().includes("keyword") || h.toLowerCase().includes("title")
                );
                if (headerIdx !== -1) {
                    keywordColIdx = headerIdx;
                    console.log(`Found keyword column matching header "${firstLine[headerIdx]}" at index ${keywordColIdx}`);
                    lines.shift();
                } else {
                    console.log(`No explicit keyword header found. Defaulting to first column.`);
                }
                
                for (const line of lines) {
                    const columns = parseCSVLine(line);
                    if (columns[keywordColIdx]) {
                        rawKeywords.push(columns[keywordColIdx]);
                    }
                }
            }
        } catch (e: any) {
            console.error(`Error fetching/parsing Google Sheet: ${e.message || e}`);
            console.log("Checking for local fallback keywords file...");
        }
    } else {
        console.log("No GOOGLE_KEYWORDS_SHEET_URL defined. Checking for local fallback keywords file...");
    }

    // Fallback if sheet fails or is not provided
    if (rawKeywords.length === 0) {
        const localCsvPath = path.join(process.cwd(), "keywords.csv");
        if (fs.existsSync(localCsvPath)) {
            console.log(`Reading keywords from local file: ${localCsvPath}`);
            const text = fs.readFileSync(localCsvPath, "utf-8");
            rawKeywords = text.split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0 && !line.toLowerCase().startsWith("keyword"));
        } else {
            console.warn("No keywords source available. Using default sample keywords.");
            rawKeywords = [
                "how to start blogging for beginners",
                "seo strategies for local business",
                "remote freelancing tips for developers"
            ];
        }
    }

    // Clean and deduplicate raw list
    const uniqueRawKeywords = Array.from(new Set(rawKeywords.map(k => k.trim()).filter(k => k.length > 0)));
    console.log(`Parsed ${uniqueRawKeywords.length} total raw keywords.`);

    // 2. Load existing articles to check for cannibalization
    console.log("Loading existing posts from MongoDB to check duplicates & cannibalization...");
    updateStatus({ currentKeyword: "Checking database content catalog..." });
    const existingPosts = await Blog.find({}).select("title slug primaryKeyword secondaryKeywords anchors").lean<any[]>();
    console.log(`Loaded ${existingPosts.length} existing articles.`);

    // 3. Process keyword queue with duplicate and semantic cannibalization checks
    const targetCount = limitArg;
    const selectedKeywords: string[] = [];
    
    console.log(`\nScanning keywords to select ${targetCount} unique topics...`);
    for (const kw of uniqueRawKeywords) {
        if (selectedKeywords.length >= targetCount) {
            break;
        }

        // Check literal duplicates in DB
        const literalCheck = checkKeywordDuplicate(kw, existingPosts);
        if (literalCheck.isDuplicate) {
            console.log(`  - [SKIP] "${kw}" - literal match in database`);
            if (!dryRun) {
                await updateGoogleSheetStatus(kw, "duplicate keyword");
            } else {
                console.log(`  [DRY-RUN] Would update Sheet for "${kw}": Status="duplicate keyword"`);
            }
            continue;
        }

        // Check duplicates against currently selected list
        const isDuplicateInBatch = selectedKeywords.some(
            sk => sk.toLowerCase() === kw.toLowerCase() || slugify(sk) === slugify(kw)
        );
        if (isDuplicateInBatch) {
            continue;
        }

        // Check semantic cannibalization in DB (Gemini-backed)
        console.log(`  Checking semantic cannibalization for: "${kw}"...`);
        updateStatus({ currentKeyword: `Checking duplication for "${kw}"...` });
        const cannibalResult = await checkCannibalization(kw, existingPosts);
        if (cannibalResult.isCannibal) {
            console.log(`  - [SKIP] "${kw}" - semantic overlap. Reason: ${cannibalResult.reason}`);
            if (!dryRun) {
                await updateGoogleSheetStatus(kw, "duplicate keyword");
            } else {
                console.log(`  [DRY-RUN] Would update Sheet for "${kw}": Status="duplicate keyword"`);
            }
            continue;
        }

        console.log(`  + [SELECT] "${kw}" is unique`);
        selectedKeywords.push(kw);
    }

    if (selectedKeywords.length === 0) {
        const msg = "No eligible unique keywords found in the sheet.";
        console.error(msg);
        updateStatus({ status: "failed", error: msg, endedAt: new Date().toISOString() });
        process.exit(0);
    }

    console.log(`\nSelected ${selectedKeywords.length} keywords for this run.`);

    // 4. Cost & Token Estimation (Groq Developer Free Tier)
    const count = selectedKeywords.length;
    const estTokens = count * 28000; // ~28K tokens per article
    
    console.log("\n-------------------------------------------------");
    console.log(" ESTIMATED GROQ API COSTS & USAGE:");
    console.log(` - Selected Keywords: ${count}`);
    console.log(` - Estimated Groq Token Usage: ~${estTokens.toLocaleString()} tokens`);
    console.log(` - Estimated Total Cost: $0.00 (Groq Developer Free Tier)`);
    console.log("-------------------------------------------------\n");

    // Write cost estimation back to status file
    updateStatus({
        progress: { current: 0, total: count },
        summary: {
            keywordsSelected: count,
            estimatedCost: 0.00,
            successCount: 0,
            failedCount: 0
        }
    });

    if (dryRun) {
        console.log(">>> RUNNING IN DRY-RUN MODE <<<\n");
    }

    // 5. Concurrent Blog Generation (Batches of 3)
    const successfulDrafts: any[] = [];
    const generationTasks = selectedKeywords.map((keyword, index) => {
        return async () => {
            console.log(`\n[STARTING] Keyword ${index + 1}/${count}: "${keyword}"`);
            updateStatus({
                currentKeyword: `Generating: "${keyword}"`,
                progress: { current: index + 1, total: count }
            });
            
            // Step A: Content Brief
            const brief = await generateContentBrief(keyword);

            // Step B: Heading Outline
            const outline = await generateOutline(brief);

            // Step C: Section Writing Loop
            let compiledHtml = "";
            let wordCountEstimate = 0;
            const sectionsList: string[] = [];
            
            for (let sIdx = 0; sIdx < outline.outline.length; sIdx++) {
                const section = outline.outline[sIdx];
                updateStatus({
                    currentKeyword: `Generating: "${keyword}" (Section ${sIdx + 1}/${outline.outline.length})`
                });
                const previousSnippet = compiledHtml.slice(-1500);
                const sectionHtml = await generateSection(brief, outline, section, previousSnippet);
                
                // Humanize each section individually to keep token count low and avoid Groq 12K TPM limit
                const humanizedSection = await humanizeSection(sectionHtml, brief.primaryKeyword);
                sectionsList.push(humanizedSection);
                compiledHtml += "\n" + humanizedSection;
                wordCountEstimate += humanizedSection.split(/\s+/).length;
            }

            // Step D: SEO Metadata & Tags
            updateStatus({ currentKeyword: `Optimizing SEO metadata: "${keyword}"` });
            const intro = sectionsList[0] || "";
            const outro = sectionsList[sectionsList.length - 1] || "";
            const metadata = await generateSeoMetadata(outline.title, outline, intro, outro, brief);

            return {
                primaryKeyword: keyword,
                title: outline.title,
                slug: slugify(outline.title),
                content: compiledHtml,
                excerpt: metadata.excerpt,
                tags: metadata.tags,
                seoTitle: metadata.seoTitle,
                seoDescription: metadata.seoDescription,
                faqs: metadata.faqs || [],
                contentBrief: brief,
                anchors: [keyword, ...(brief.secondaryKeywords || []).slice(0, 3)]
            };
        };
    });

    // Run parallel queue with concurrency limit of 3
    const generationResults = await runWithConcurrencyLimit(generationTasks, 3);
    
    for (let i = 0; i < generationResults.length; i++) {
        const res = generationResults[i];
        if (res instanceof Error) {
            console.error(`CRITICAL: Keyword "${selectedKeywords[i]}" failed permanently:`, res.message);
        } else if (res) {
            successfulDrafts.push(res);
        }
    }

    console.log(`\nGenerated ${successfulDrafts.length}/${selectedKeywords.length} blog post drafts.`);
    updateStatus({
        currentKeyword: "Performing cross-linking and QA reports...",
        "summary.successCount": successfulDrafts.length,
        "summary.failedCount": selectedKeywords.length - successfulDrafts.length
    });

    if (successfulDrafts.length === 0) {
        const msg = "No drafts successfully generated.";
        console.error(msg);
        updateStatus({ status: "failed", error: msg, endedAt: new Date().toISOString() });
        process.exit(1);
    }

    // 6. Dynamic Internal Linking
    console.log("\nBuilding combined link inventory for batch cross-linking...");
    const existingBlogInventory = existingPosts.map(b => ({
        slug: b.slug,
        primaryKeyword: b.primaryKeyword || b.title,
        secondaryKeywords: b.secondaryKeywords || [],
        anchors: b.anchors || []
    }));

    const newDraftsInventory = successfulDrafts.map(d => ({
        slug: d.slug,
        primaryKeyword: d.primaryKeyword,
        secondaryKeywords: d.contentBrief.secondaryKeywords || [],
        anchors: d.anchors || []
    }));

    const combinedInventory: LinkInventoryItem[] = [...existingBlogInventory, ...newDraftsInventory];
    const allValidSlugs = combinedInventory.map(item => item.slug);

    // Run linker, validator, and self-repair for each successful draft
    const finalizedPosts: any[] = [];

    for (let idx = 0; idx < successfulDrafts.length; idx++) {
        const draft = successfulDrafts[idx];
        const linkedHtml = linkifyHtml(draft.content, draft.slug, combinedInventory, 8);
        
        let qaReport = validateSeo(
            linkedHtml, 
            draft.seoTitle, 
            draft.seoDescription, 
            draft.primaryKeyword, 
            allValidSlugs
        );

        const metadataIssues = qaReport.issues.filter(i => 
            i.toLowerCase().includes("title length") || i.toLowerCase().includes("description length")
        );

        if (metadataIssues.length > 0) {
            const repairedMeta = await selfRepairMetadata(
                linkedHtml,
                draft.contentBrief,
                metadataIssues,
                draft.seoTitle,
                draft.seoDescription
            );
            
            if (repairedMeta) {
                draft.seoTitle = repairedMeta.seoTitle;
                draft.seoDescription = repairedMeta.seoDescription;
                draft.excerpt = repairedMeta.excerpt;
                draft.tags = repairedMeta.tags;
                
                qaReport = validateSeo(
                    linkedHtml,
                    draft.seoTitle,
                    draft.seoDescription,
                    draft.primaryKeyword,
                    allValidSlugs
                );
            }
        }

        finalizedPosts.push({
            ...draft,
            content: linkedHtml,
            qaReport: {
                wordCount: qaReport.wordCount,
                headingCounts: qaReport.headingCounts,
                internalLinkCount: qaReport.internalLinkCount,
                primaryKeywordPresence: qaReport.primaryKeywordPresence,
                metaTitleLength: qaReport.metaTitleLength,
                metaDescriptionLength: qaReport.metaDescriptionLength,
                status: qaReport.status
            }
        });
    }

    // 7. Scheduling and Database Save
    console.log("\nFinalizing database saves & sequential publication times...");
    const scheduledPosts = await Blog.find({ scheduledFor: { $ne: null } })
        .sort({ scheduledFor: -1 })
        .limit(1)
        .lean<IBlog[]>();
        
    let baseDate = new Date();
    if (scheduledPosts.length > 0 && scheduledPosts[0].scheduledFor) {
        const latestScheduledDate = new Date(scheduledPosts[0].scheduledFor);
        if (latestScheduledDate > baseDate) {
            baseDate = latestScheduledDate;
        }
    }

    for (let i = 0; i < finalizedPosts.length; i++) {
        const post = finalizedPosts[i];
        
        // Calculate (i + 1) days from the baseDate
        const scheduledTime = new Date(baseDate);
        scheduledTime.setDate(scheduledTime.getDate() + (i + 1));
        
        // Set to exactly 9:00 AM IST (3:30 AM UTC)
        scheduledTime.setUTCHours(3, 30, 0, 0);
        
        // If scheduledTime is in the past, add another day
        if (scheduledTime.getTime() <= Date.now()) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        post.scheduledFor = scheduledTime;
        post.status = "draft";
        post.aiGenerated = true;

        if (dryRun) {
            console.log(`  [DRY-RUN] Skipped MongoDB save for: "${post.title}" (Scheduled: ${scheduledTime.toISOString()})`);
            console.log(`  [DRY-RUN] Would update Sheet for "${post.primaryKeyword}": Status="Published", URL="https://www.sharikrasool.com/blog/${post.slug}"`);
        } else {
            try {
                await Blog.findOneAndUpdate(
                    { slug: post.slug },
                    post,
                    { upsert: true, new: true }
                );
                console.log(`  Saved: "${post.title}" (Scheduled: ${scheduledTime.toISOString()})`);
                
                const liveUrl = `https://www.sharikrasool.com/blog/${post.slug}`;
                await updateGoogleSheetStatus(post.primaryKeyword, "Published", liveUrl, post.title);
            } catch (saveErr: any) {
                console.error(`  ERROR saving "${post.title}":`, saveErr.message || saveErr);
            }
        }
    }

    console.log("\n=========================================");
    console.log("   AUTOMATION RUN COMPLETED SUCCESSFULLY  ");
    console.log("=========================================\n");
    
    updateStatus({
        status: "completed",
        endedAt: new Date().toISOString(),
        currentKeyword: "Finished successfully"
    });

    // Sync live URLs to Sheet automatically on success
    if (!dryRun) {
        await syncLiveUrlsToGoogleSheet();
    }

    await mongoose.connection.close();
    process.exit(0);
}

main().catch(err => {
    console.error("FATAL ERROR IN RUNNER:", err.message || err);
    updateStatus({
        status: "failed",
        endedAt: new Date().toISOString(),
        error: err.message || String(err),
        currentKeyword: "Fatal failure"
    });
    mongoose.connection.close().then(() => process.exit(1));
});
