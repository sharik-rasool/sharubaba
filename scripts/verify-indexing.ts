import mongoose from "mongoose";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as jose from "jose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import Blog from "../src/models/Blog";

const serviceAccountPath = path.join(process.cwd(), "service-account.json");
const mongoUri = process.env.MONGODB_URI || "";
const domain = "https://www.sharikrasool.com";
// GSC siteUrl property (must match the property exactly in Search Console)
const siteUrl = "sc-domain:sharikrasool.com"; 

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
    const pkcs8Key = await jose.importPKCS8(privateKey, "RS256");

    const jwt = await new jose.SignJWT({
        scope: "https://www.googleapis.com/auth/webmasters.readonly https://www.googleapis.com/auth/spreadsheets"
    })
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuer(clientEmail)
        .setAudience("https://oauth2.googleapis.com/token")
        .setExpirationTime("1h")
        .setIssuedAt()
        .sign(pkcs8Key);

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to get Google OAuth access token: ${errorText}`);
    }

    const data = await res.json();
    return data.access_token;
}

async function inspectUrl(url: string, siteUrl: string, accessToken: string, retries: number = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inspectionUrl: url,
                    siteUrl: siteUrl
                })
            });

            const data = await res.json();
            if (!res.ok) {
                if (res.status === 429) {
                    console.warn(`  [GSC API] Rate limit (429) hit. Waiting 5s before attempt ${attempt + 1}/${retries}...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    continue;
                }
                return { success: false, error: data };
            }

            return { success: true, result: data.inspectionResult };
        } catch (err: any) {
            console.warn(`  [GSC API] Network/Fetch failed: ${err.message || err}. Attempt ${attempt}/${retries}...`);
            if (attempt >= retries) {
                return { success: false, error: { error: { message: err.message || String(err) } } };
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function writeToGoogleSheet(spreadsheetId: string, values: any[][], accessToken: string): Promise<any> {
    console.log(`Writing verification results to Google Sheet ID: ${spreadsheetId}...`);
    const range = "indexing status!A1:J";
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            range: range,
            majorDimension: "ROWS",
            values: values
        })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Google Sheets API Error: ${data.error?.message || JSON.stringify(data)}`);
    }
    console.log("Successfully updated Google Sheet tab 'indexing status'!");
}

async function main() {
    console.log("=========================================");
    console.log("    GOOGLE SEARCH CONSOLE STATUS CHECK    ");
    console.log("=========================================\n");

    const args = process.argv.slice(2);
    const checkAll = args.includes("--all");

    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`ERROR: Service account key file not found at: ${serviceAccountPath}`);
        console.error("Please place your downloaded Google Cloud service-account.json credentials file in the root directory.");
        process.exit(1);
    }

    let serviceAccount;
    try {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    } catch (err: any) {
        console.error("ERROR: Failed to parse service-account.json:", err.message || err);
        process.exit(1);
    }

    const clientEmail = serviceAccount.client_email;
    const privateKey = serviceAccount.private_key;

    if (!clientEmail || !privateKey) {
        console.error("ERROR: Invalid service-account.json structure. client_email or private_key missing.");
        process.exit(1);
    }

    if (!mongoUri) {
        console.error("ERROR: MONGODB_URI is not defined in environment.");
        process.exit(1);
    }

    // 2. Connect to MongoDB
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB.");
    } catch (err: any) {
        console.error(`ERROR: MongoDB connection failed: ${err.message || err}`);
        process.exit(1);
    }

    // 3. Query blogs
    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    let query = {};
    if (checkAll) {
        console.log("Scanning GSC status for ALL live blogs...");
        query = {
            $or: [
                {
                    status: "published",
                    $or: [
                        { scheduledFor: { $lte: now } },
                        { scheduledFor: { $exists: false } },
                        { scheduledFor: null }
                    ]
                },
                {
                    status: "draft",
                    scheduledFor: { $lte: now }
                }
            ]
        };
    } else {
        console.log("Scanning GSC status for blogs published/scheduled in the last 3 days...");
        query = {
            $or: [
                {
                    status: "published",
                    $or: [
                        { scheduledFor: { $gte: threeDaysAgo, $lte: now } },
                        { scheduledFor: { $exists: false } },
                        { scheduledFor: null, createdAt: { $gte: threeDaysAgo } }
                    ]
                },
                {
                    status: "draft",
                    scheduledFor: { $gte: threeDaysAgo, $lte: now }
                }
            ]
        };
    }

    const blogs = await Blog.find(query).select("title slug").lean<any[]>();
    console.log(`Found ${blogs.length} blog(s) to verify in GSC.`);

    if (blogs.length === 0) {
        console.log("No blogs found to check. Exiting.");
        await mongoose.disconnect();
        process.exit(0);
    }

    // 4. Get Access Token
    let accessToken: string;
    try {
        accessToken = await getAccessToken(clientEmail, privateKey);
    } catch (authErr: any) {
        console.error("ERROR: Google authentication failed:", authErr.message || authErr);
        await mongoose.disconnect();
        process.exit(1);
    }

    // 5. Inspect each URL
    console.log("\nQuerying Google Search Console Index Status...");
    console.log("Note: Inspecting URLs takes a few seconds per request due to GSC limits.\n");

    const sheetUrl = process.env.GOOGLE_KEYWORDS_SHEET_URL || "";
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const spreadsheetId = match ? match[1] : "";

    const sheetRows: any[][] = [
        ["URL", "Title", "Index Verdict", "Indexed Status", "Last Crawl Time", "Coverage State", "Last Checked At", "", "Summary Metrics", "Value"]
    ];

    const results = [];
    let indexedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const url = `${domain}/blog/${blog.slug}`;
        console.log(`[${i + 1}/${blogs.length}] Inspecting: ${url}...`);

        const res = await inspectUrl(url, siteUrl, accessToken);
        
        if (res.success) {
            const indexStatus = res.result.indexStatusResult;
            const verdict = indexStatus?.verdict || "UNKNOWN";
            const coverage = indexStatus?.coverageState || "No coverage info";
            const lastCrawl = indexStatus?.lastCrawlTime || "Never crawled";

            console.log(`  -> Verdict: ${verdict} | Last Crawl: ${lastCrawl}`);

            const isIndexed = (verdict === "GOOD" || verdict === "INDEXED" || verdict === "PASS");
            if (isIndexed) {
                indexedCount++;
            } else {
                pendingCount++;
            }

            const rowData = [
                url,
                blog.title,
                verdict,
                isIndexed ? "INDEXED" : "PENDING",
                lastCrawl,
                coverage,
                now.toISOString()
            ];

            if (i === 0) {
                sheetRows.push([...rowData, "", "Total Blogs:", "=COUNTA(A2:A)"]);
            } else if (i === 1) {
                sheetRows.push([...rowData, "", "Indexed Blogs:", "=COUNTIF(D2:D, \"INDEXED\")"]);
            } else if (i === 2) {
                sheetRows.push([...rowData, "", "Pending Indexing:", "=COUNTIF(D2:D, \"PENDING\")"]);
            } else {
                sheetRows.push([...rowData, "", "", ""]);
            }

            results.push({
                title: blog.title,
                url,
                verdict,
                coverage,
                lastCrawl
            });
        } else {
            console.error(`  -> Failed to inspect URL:`, res.error?.error?.message || res.error);
            failedCount++;
            
            const rowData = [
                url,
                blog.title,
                "API_ERROR",
                "FAILED TO CHECK",
                "N/A",
                res.error?.error?.message || "Unknown GSC API Error",
                now.toISOString()
            ];

            if (i === 0) {
                sheetRows.push([...rowData, "", "Total Blogs:", "=COUNTA(A2:A)"]);
            } else if (i === 1) {
                sheetRows.push([...rowData, "", "Indexed Blogs:", "=COUNTIF(D2:D, \"INDEXED\")"]);
            } else if (i === 2) {
                sheetRows.push([...rowData, "", "Pending Indexing:", "=COUNTIF(D2:D, \"PENDING\")"]);
            } else {
                sheetRows.push([...rowData, "", "", ""]);
            }

            results.push({
                title: blog.title,
                url,
                verdict: "API_ERROR",
                coverage: res.error?.error?.message || "Unknown GSC API Error",
                lastCrawl: "N/A"
            });
        }
        
        // Sleep 1 second to avoid hitting Search Console API rate limits (120 RPM limit)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 6. Output Summary Report
    console.log("\n=========================================");
    console.log("            INDEX STATUS REPORT          ");
    console.log("=========================================");
    console.log(`- Total URLs Scanned: ${blogs.length}`);
    console.log(`- Verified Indexed:  ${indexedCount} ✅`);
    console.log(`- Pending Indexing:  ${pendingCount} ⏳`);
    if (failedCount > 0) {
        console.log(`- Inspection Failed: ${failedCount} ❌ (See error output)`);
    }
    console.log("=========================================\n");

    if (spreadsheetId) {
        try {
            await writeToGoogleSheet(spreadsheetId, sheetRows, accessToken);
        } catch (sheetErr: any) {
            console.error("ERROR: Failed to write to Google Sheets:", sheetErr.message || sheetErr);
        }
    } else {
        console.log("No GOOGLE_KEYWORDS_SHEET_URL defined in environment. Skipping Google Sheets update.");
    }

    await mongoose.disconnect();
}

main().catch(err => {
    console.error("FATAL ERROR in Indexing Verifier:", err.message || err);
    mongoose.disconnect().then(() => process.exit(1));
});
