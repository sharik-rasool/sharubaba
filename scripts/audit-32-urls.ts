import * as fs from "fs";
import * as path from "path";
import * as jose from "jose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const serviceAccountPath = path.join(process.cwd(), "service-account.json");
const siteUrl = "sc-domain:sharikrasool.com";

const urls = [
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
    scope: "https://www.googleapis.com/auth/webmasters.readonly"
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
    throw new Error(`OAuth error: ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function inspectUrl(url: string, accessToken: string) {
  try {
    const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inspectionUrl: url, siteUrl })
    });
    const data = await res.json();
    return data.inspectionResult || { error: data };
  } catch (err: any) {
    return { error: err.message };
  }
}

async function checkLivePage(url: string) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" } });
    const status = res.status;
    const html = await res.text();
    
    // Canonical in HTML
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                           html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    const declaredCanonical = canonicalMatch ? canonicalMatch[1] : null;

    // Meta Robots in HTML
    const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
    const metaRobots = robotsMatch ? robotsMatch[1] : "index, follow (default)";

    // Title & H1
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : "";

    // Word count (approximate visible text)
    const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
                     .replace(/<[^>]+>/g, " ")
                     .replace(/\s+/g, " ")
                     .trim();
    const wordCount = text.split(" ").length;

    return { status, declaredCanonical, metaRobots, title, h1, wordCount };
  } catch (err: any) {
    return { status: 500, error: err.message, declaredCanonical: null, metaRobots: "", title: "", h1: "", wordCount: 0 };
  }
}

async function main() {
  const sa = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  console.log("Authenticating with Google Search Console API...");
  const token = await getAccessToken(sa.client_email, sa.private_key);

  const results: any[] = [];
  console.log(`Auditing ${urls.length} URLs...\n`);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] Auditing: ${url}`);
    
    const [gscData, liveData] = await Promise.all([
      inspectUrl(url, token),
      checkLivePage(url)
    ]);

    const statusResult = gscData?.indexStatusResult || {};

    const item = {
      url,
      httpStatus: liveData.status,
      declaredCanonical: liveData.declaredCanonical,
      googleCanonical: statusResult.googleCanonical || "None / Not Selected",
      userCanonicalInGsc: statusResult.userCanonical || "None",
      canonicalMatch: liveData.declaredCanonical === statusResult.googleCanonical,
      verdict: statusResult.verdict || "NEUTRAL",
      coverageState: statusResult.coverageState || "Unknown",
      indexingState: statusResult.indexingState || "Unknown",
      pageFetchState: statusResult.pageFetchState || "Unknown",
      robotsTxtState: statusResult.robotsTxtState || "Unknown",
      lastCrawlTime: statusResult.lastCrawlTime || "Never",
      crawledAs: statusResult.crawledAs || "Unknown",
      referringUrls: statusResult.referringUrls || [],
      sitemap: statusResult.sitemap || [],
      metaRobots: liveData.metaRobots,
      wordCount: liveData.wordCount,
      title: liveData.title,
      h1: liveData.h1,
      rawGscError: gscData.error || null
    };

    results.push(item);
    // Pause briefly to be polite to GSC API rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  const outPath = path.join(process.cwd(), "scripts/audit-32-results.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nAudit completed! Results saved to ${outPath}`);
}

main().catch(console.error);
