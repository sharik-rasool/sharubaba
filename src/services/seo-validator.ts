import { parse } from "node-html-parser";

export interface QaReport {
    wordCount: number;
    headingCounts: Record<string, number>;
    internalLinkCount: number;
    primaryKeywordPresence: boolean;
    metaTitleLength: number;
    metaDescriptionLength: number;
    status: "passed" | "warned" | "failed";
    issues: string[];
}

/**
 * Validate article SEO compliance and build a detailed QA report
 */
export function validateSeo(
    htmlContent: string,
    metaTitle: string,
    metaDescription: string,
    primaryKeyword: string,
    validSlugs: string[] // List of all valid blog slugs in database and current batch
): QaReport {
    const issues: string[] = [];
    let status: "passed" | "warned" | "failed" = "passed";

    if (!htmlContent) {
        return {
            wordCount: 0,
            headingCounts: {},
            internalLinkCount: 0,
            primaryKeywordPresence: false,
            metaTitleLength: metaTitle.length,
            metaDescriptionLength: metaDescription.length,
            status: "failed",
            issues: ["HTML content is empty."]
        };
    }

    const root = parse(htmlContent);

    // 1. Word Count Validation
    const textContent = root.text || "";
    const words = textContent.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount < 3000) {
        status = "failed";
        issues.push(`Word count is ${wordCount}, which is below the minimum limit of 3,000 words.`);
    } else if (wordCount > 3500) {
        issues.push(`Word count is ${wordCount}, exceeding the optimal target of 3,500 words.`);
        if ((status as string) !== "failed") status = "warned";
    }

    // 2. Heading Counts & Hierarchy Validation
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headingCounts: Record<string, number> = { h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    let hasH1InBody = false;
    let headingHierarchyValid = true;
    let maxHeadingLevelAllowed = 2; // Can always start with H2
    const headingTexts: string[] = [];

    headings.forEach((h) => {
        const tag = h.tagName.toLowerCase();
        headingTexts.push(h.text.trim().toLowerCase());
        
        if (tag === "h1") {
            hasH1InBody = true;
            headingCounts["h1"] = (headingCounts["h1"] || 0) + 1;
        } else {
            headingCounts[tag] = (headingCounts[tag] || 0) + 1;
        }

        const level = parseInt(h.tagName.substring(1));
        if (level === 1) {
            headingHierarchyValid = false;
        } else if (level > maxHeadingLevelAllowed) {
            headingHierarchyValid = false;
        } else {
            maxHeadingLevelAllowed = Math.max(maxHeadingLevelAllowed, level + 1);
        }
    });

    if (hasH1InBody) {
        issues.push("Article body contains H1 tags. Main headings must start at H2.");
        if (status !== "failed") status = "warned";
    }

    if (!headingHierarchyValid) {
        issues.push("Invalid heading hierarchy detected (e.g. H3 before H2, or level skipped).");
        if (status !== "failed") status = "warned";
    }

    // 3. Duplicate Headings Check
    const uniqueHeadings = new Set(headingTexts);
    if (headingTexts.length !== uniqueHeadings.size) {
        issues.push("Duplicate headings detected. All heading texts should be unique.");
        if (status !== "failed") status = "warned";
    }

    // 4. Primary Keyword Presence
    const escapedKeyword = primaryKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const keywordRegex = new RegExp(`\\b${escapedKeyword}\\b`, "i");
    const primaryKeywordPresence = keywordRegex.test(textContent);

    if (!primaryKeywordPresence) {
        issues.push(`Primary keyword "${primaryKeyword}" was not found in the article body.`);
        if (status !== "failed") status = "warned";
    }

    // 5. Meta Title Length (Target: 50-60 characters)
    const metaTitleLength = metaTitle ? metaTitle.length : 0;
    if (metaTitleLength < 50 || metaTitleLength > 60) {
        issues.push(`Meta title length is ${metaTitleLength} characters (target is 50-60).`);
        if (status !== "failed") status = "warned";
    }

    // 6. Meta Description Length (Target: 140-160 characters)
    const metaDescriptionLength = metaDescription ? metaDescription.length : 0;
    if (metaDescriptionLength < 140 || metaDescriptionLength > 160) {
        issues.push(`Meta description length is ${metaDescriptionLength} characters (target is 140-160).`);
        if (status !== "failed") status = "warned";
    }

    // 7. Internal Link Count & Validation
    const links = root.querySelectorAll("a");
    const internalLinkCount = links.length;
    let brokenLinksCount = 0;

    links.forEach((l) => {
        const href = l.getAttribute("href") || "";
        if (href.startsWith("/blog/")) {
            const slug = href.substring("/blog/".length);
            if (!validSlugs.includes(slug)) {
                brokenLinksCount++;
                issues.push(`Broken internal link found pointing to non-existent blog: "${href}"`);
            }
        } else if (!href.startsWith("/") && !href.startsWith("http") && !href.startsWith("mailto")) {
            brokenLinksCount++;
            issues.push(`Malformed or invalid relative link format: "${href}"`);
        }
    });

    if (brokenLinksCount > 0) {
        status = "failed";
        issues.push(`${brokenLinksCount} broken or malformed internal link(s) detected.`);
    }

    return {
        wordCount,
        headingCounts,
        internalLinkCount,
        primaryKeywordPresence,
        metaTitleLength,
        metaDescriptionLength,
        status,
        issues
    };
}
