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

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
    const pkcs8Key = await jose.importPKCS8(privateKey, "RS256");

    const jwt = await new jose.SignJWT({
        scope: "https://www.googleapis.com/auth/indexing"
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

async function submitToIndexingApi(url: string, accessToken: string): Promise<any> {
    console.log(`[Indexing API] Submitting URL: ${url}`);
    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: url,
            type: "URL_UPDATED"
        })
    });

    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = { error: { message: text } };
    }

    if (!res.ok) {
        console.error(`[Indexing API] Error submitting ${url}:`, data.error?.message || data);
        return { success: false, url, error: data };
    }

    console.log(`[Indexing API] Successfully submitted ${url}. Google Response status:`, data.urlNotificationMetadata?.latestUpdate?.type);
    return { success: true, url, data };
}

async function main() {
    console.log("=========================================");
    console.log("      GOOGLE GSC INDEXING API RUNNER      ");
    console.log("=========================================\n");

    // 1. Load service account credentials
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
        console.log("Connected to MongoDB database.");
    } catch (err: any) {
        console.error(`ERROR: MongoDB connection failed: ${err.message || err}`);
        process.exit(1);
    }

    // 3. Find published blogs (last 3 days by default, or all if --all is specified)
    const args = process.argv.slice(2);
    const indexAll = args.includes("--all");

    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    let query = {};
    if (indexAll) {
        console.log("Flag --all detected. Scanning for ALL published and scheduled blogs...");
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
        console.log(`Scanning for published blogs since ${threeDaysAgo.toISOString()}...`);
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

    const eligibleBlogs = await Blog.find(query).lean<any[]>();
    console.log(`Found ${eligibleBlogs.length} eligible blog(s) to index.`);

    if (eligibleBlogs.length === 0) {
        console.log("No new blogs found to index in GSC. Exiting.");
        await mongoose.disconnect();
        process.exit(0);
    }

    // 4. Get Google Indexing API access token
    let accessToken: string;
    try {
        console.log("Authorizing with Google OAuth2...");
        accessToken = await getAccessToken(clientEmail, privateKey);
        console.log("Authorization successful.");
    } catch (authErr: any) {
        console.error("ERROR: Google authentication failed:", authErr.message || authErr);
        await mongoose.disconnect();
        process.exit(1);
    }

    // 5. Submit URLs to Google Indexing API
    for (const blog of eligibleBlogs) {
        const url = `${domain}/blog/${blog.slug}`;
        try {
            await submitToIndexingApi(url, accessToken);
        } catch (submitErr: any) {
            console.error(`Failed to submit URL ${url}:`, submitErr.message || submitErr);
        }
    }

    console.log("\n=========================================");
    console.log("      INDEXING SUBMISSION COMPLETED       ");
    console.log("=========================================\n");

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error("FATAL ERROR in Indexing Runner:", err.message || err);
    mongoose.disconnect().then(() => process.exit(1));
});
