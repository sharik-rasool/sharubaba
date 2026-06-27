import mongoose from "mongoose";
import dotenv from "dotenv";
import { toolsData } from "../src/lib/tools-data";
import Blog from "../src/models/Blog";

dotenv.config({ path: ".env.local" });

const domain = "https://www.sharikrasool.com";

interface SyncUrlPayload {
    url: string;
    category: string;
}

async function main() {
    const webhookUrl = process.env.GOOGLE_KEYWORDS_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error("Error: GOOGLE_KEYWORDS_SHEET_WEBHOOK_URL is not set in environment.");
        process.exit(1);
    }

    const mongoUri = process.env.MONGODB_URI || "";
    if (!mongoUri) {
        console.error("Error: MONGODB_URI is not set in environment.");
        process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    const urls: SyncUrlPayload[] = [];

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
        urls.push({
            url: `${domain}${p.path}`,
            category: p.category,
        });
    });

    // 2. Interactive Tools
    toolsData.forEach(tool => {
        urls.push({
            url: `${domain}/tools/${tool.slug}`,
            category: "Interactive Tool",
        });
    });

    // 3. Published Blog Posts
    const now = new Date();
    const publishedPosts = await Blog.find({
        $or: [
            { scheduledFor: { $lte: now } },
            { scheduledFor: { $exists: false } },
            { scheduledFor: null }
        ]
    }).sort({ createdAt: -1 }).lean();

    publishedPosts.forEach(post => {
        urls.push({
            url: `${domain}/blog/${post.slug}`,
            category: "Blog Post",
        });
    });

    await mongoose.connection.close();

    console.log(`Aggregated ${urls.length} live URLs. Sending to Google Sheets Webhook...`);

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: "live_urls_sync",
            urls: urls,
        }),
    });

    if (response.ok) {
        const result = await response.json();
        console.log("Success! Server Response:", result);
    } else {
        const text = await response.text();
        console.error(`Failed to send webhook. Status: ${response.status}. Response:`, text);
    }
}

main().catch(console.error);
