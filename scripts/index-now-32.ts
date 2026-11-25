import * as fs from "fs";
import * as path from "path";
import * as jose from "jose";

const serviceAccountPath = path.join(process.cwd(), "service-account.json");

const TARGET_URLS = [
    "https://www.sharikrasool.com/blog/freelance-social-media-manager-tips",
    "https://www.sharikrasool.com/blog/saas-link-building-services",
    "https://www.sharikrasool.com/blog/content-outreach-link-building-boost-quality-backlinks",
    "https://www.sharikrasool.com/blog/building-link-customer-service-for-better-seo",
    "https://www.sharikrasool.com/blog/mastering-blogging-for-photographers-strategies-best-practices",
    "https://www.sharikrasool.com/blog/the-ultimate-guide-to-guest-blogging-for-seo-boosting-your-online-presence",
    "https://www.sharikrasool.com/blog/how-to-use-pinterest-for-blogging-traffic-and-success",
    "https://www.sharikrasool.com/blog/the-ultimate-guide-to-seo-without-link-building-strategies-and-techniques",
    "https://www.sharikrasool.com/blog/does-blogging-help-seo-a-comprehensive-guide-to-unlocking-search-engine-optimization-benefits",
    "https://www.sharikrasool.com/blog/blogging-strategy-key-tips",
    "https://www.sharikrasool.com/blog/blogging-dirty-secrets",
    "https://www.sharikrasool.com/blog/link-building-for-igaming-strategies-to-boost-rankings",
    "https://www.sharikrasool.com/blog/the-ultimate-guide-to-white-label-link-building-agencies",
    "https://www.sharikrasool.com/blog/ahrefs-blogging-for-business",
    "https://www.sharikrasool.com/blog/local-link-building-service",
    "https://www.sharikrasool.com/blog/boost-rankings-with-contextual-link-building-services",
    "https://www.sharikrasool.com/blog/link-building-for-lawyers",
    "https://www.sharikrasool.com/blog/how-to-start-freelancing-as-a-web-developer",
    "https://www.sharikrasool.com/blog/remote-freelancing-tips-for-developers",
    "https://www.sharikrasool.com/blog/backlink-outreach-services-how-to-get-authority-links",
    "https://www.sharikrasool.com/blog/how-to-write-a-freelancing-resume",
    "https://www.sharikrasool.com/blog/finding-and-succeeding-in-entry-level-blogging-jobs",
    "https://www.sharikrasool.com/blog/backlink-submission-high-impact-sites-and-strategies",
    "https://www.sharikrasool.com/blog/white-label-web-development-scaling-agency-growth",
    "https://www.sharikrasool.com/blog/the-ultimate-guide-to-starting-a-blog-for-beginners",
    "https://www.sharikrasool.com/blog/high-income-freelancing-skills",
    "https://www.sharikrasool.com/blog/how-to-stop-spam-blogging-and-protect-your-sites-reputation",
    "https://www.sharikrasool.com/blog/blogging-for-small-businesses-strategies-to-boost-growth",
    "https://www.sharikrasool.com/blog/local-seo-vs-traditional-seo-a-comprehensive-guide-to-link-building-and-google-maps-optimization",
    "https://www.sharikrasool.com/blog/the-ultimate-guide-to-outsourcing-link-building-benefits-costs-and-best-practices",
    "https://www.sharikrasool.com/blog/mastering-seo-strategies-for-local-business-a-comprehensive-guide",
    "https://www.sharikrasool.com/tools/random-pokemon-generator"
];

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

async function submitToIndexingApi(url: string, accessToken: string) {
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
        return { success: false, url, error: data };
    }

    return { 
        success: true, 
        url, 
        notifyTime: data.urlNotificationMetadata?.latestUpdate?.notifyTime,
        type: data.urlNotificationMetadata?.latestUpdate?.type
    };
}

async function main() {
    console.log("=========================================");
    console.log("   GOOGLE INDEXING API BATCH SUBMISSION  ");
    console.log(`   Target URLs: ${TARGET_URLS.length}`);
    console.log("=========================================\n");

    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`ERROR: service-account.json not found at ${serviceAccountPath}`);
        process.exit(1);
    }

    const sa = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    const clientEmail = sa.client_email;
    const privateKey = sa.private_key;

    console.log(`Authenticating as: ${clientEmail}...`);
    const accessToken = await getAccessToken(clientEmail, privateKey);
    console.log("✓ Google OAuth2 Bearer Token Acquired.\n");

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < TARGET_URLS.length; i++) {
        const url = TARGET_URLS[i];
        process.stdout.write(`[${i + 1}/${TARGET_URLS.length}] Submitting: ${url}... `);

        try {
            const res = await submitToIndexingApi(url, accessToken);
            if (res.success) {
                console.log(`✓ SUCCESS (notified: ${res.notifyTime})`);
                successCount++;
            } else {
                console.log(`✗ FAILED:`, JSON.stringify(res.error));
                failCount++;
            }
            results.push(res);
        } catch (err: any) {
            console.log(`✗ EXCEPTION: ${err.message}`);
            failCount++;
            results.push({ success: false, url, error: err.message });
        }

        // Polite delay between API calls
        await new Promise((r) => setTimeout(r, 200));
    }

    console.log("\n=========================================");
    console.log(`Finished: ${successCount} Succeeded, ${failCount} Failed`);
    console.log("=========================================");

    const reportPath = path.join(process.cwd(), "scripts", "indexing-submission-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`Report saved to: ${reportPath}`);
}

main().catch(console.error);
