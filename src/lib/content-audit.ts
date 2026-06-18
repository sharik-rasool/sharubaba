/**
 * Shared utility for auditing blog post content size, images, and base64 detection.
 */

import { validateHeadingHierarchy, detectMalformedHeadings, detectDeprecatedMarkup } from "./blog-cleaner";
import { slugify } from "./toc";

/**
 * Shared utility for auditing blog post content size, headings, images, links, and SEO metrics.
 */

export interface ContentHealth {
    contentSize: number;       // Size in bytes
    imageCount: number;        // Total <img> tags
    base64Count: number;       // Total base64 images
    headingsCount: number;     // Total headings (h2, h3, h4)
    emptyHeadingsCount: number; // Headings with no text/whitespace only
    imageHeadingsCount: number; // Headings wrapping only an image
    missingIdsCount: number;    // Headings missing an id attribute
    missingAltCount: number;    // Images missing or having empty alt
    missingDimensionsCount: number; // Images missing width or height
    internalLinksCount: number; // Internal links count
    brokenLinksCount: number;   // Broken or placeholder links count
    brokenLinksList: string[];  // List of broken or placeholder links
    seoHealthScore: number;     // SEO health score (0-100)
    hierarchyWarnings: string[]; // Heading hierarchy warning strings
    status: "safe" | "warning" | "critical";
    messages: string[];

    // Phase 2 Additions
    malformedHeadingsCount: number;
    malformedHeadingsList: string[];
    missingCanonical: boolean;
    missingMetaDesc: boolean;
    missingOgImage: boolean;
    missingSchemaProps: string[];
    duplicateAlts: string[];
    shortAltsCount: number;
    genericAltsCount: number;
    oversizedImagesCount: number;
    deprecatedTagsCount: number;
    deprecatedAttrsCount: number;
    deprecatedDetails: string[];
    heavyEmbedsCount: number;
    incomingLinksCount: number;
    isOrphan: boolean;
    internalLinkSuggestions: { title: string; slug: string; matchedPhrase: string }[];
    ageInDays: number;
    renderedContentSize: number;
    imagePayloadEstimate: number;
    externalScriptsCount: number;
}

export function scanContentHealth(
    content: string = "",
    blogMeta?: {
        title?: string;
        slug?: string;
        seoDescription?: string;
        canonicalUrl?: string;
        ogImage?: string;
        coverImage?: string;
        createdAt?: Date | string;
        updatedAt?: Date | string;
        tags?: string[];
    },
    allBlogs?: { _id: string; title: string; slug: string; content: string; createdAt?: Date | string; tags?: string[] }[],
    currentBlogId?: string
): ContentHealth {
    let contentSize = 0;
    if (content) {
        if (typeof Buffer !== "undefined") {
            contentSize = Buffer.byteLength(content, "utf8");
        } else if (typeof Blob !== "undefined") {
            contentSize = new Blob([content]).size;
        } else {
            contentSize = content.length; // Fallback
        }
    }

    let imageCount = 0;
    let base64Count = 0;
    let missingAltCount = 0;
    let missingDimensionsCount = 0;

    let headingsCount = 0;
    let emptyHeadingsCount = 0;
    let imageHeadingsCount = 0;
    let missingIdsCount = 0;

    let internalLinksCount = 0;
    let brokenLinksCount = 0;
    const brokenLinksList: string[] = [];

    // 1. Heading Analysis
    const headingRegex = /<(h[2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
    let headingMatch;
    while ((headingMatch = headingRegex.exec(content)) !== null) {
        headingsCount++;
        const attrs = headingMatch[2] || "";
        const innerContent = headingMatch[3] || "";
        const plainText = innerContent.replace(/<[^>]*>?/gm, "").trim();

        // Check for missing ID
        if (!/\bid\s*=\s*["']/i.test(attrs)) {
            missingIdsCount++;
        }

        // Check empty or image-only
        if (!plainText || plainText.replace(/&nbsp;/g, "").trim() === "") {
            const hasImg = /<img\b[^>]*>/i.test(innerContent);
            if (hasImg) {
                imageHeadingsCount++;
            } else {
                emptyHeadingsCount++;
            }
        }
    }

    // Malformed Heading Detection
    const malformedHeadingsList = detectMalformedHeadings(content);
    const malformedHeadingsCount = malformedHeadingsList.length;

    // 2. Image Analysis
    const imgRegex = /<img\b([^>]*?)>/gi;
    let imgMatch;
    const allAlts: string[] = [];
    let shortAltsCount = 0;
    let genericAltsCount = 0;
    let oversizedImagesCount = 0;
    const genericWords = ["image", "screenshot", "photo", "img", "pic", "picture", "logo"];

    while ((imgMatch = imgRegex.exec(content)) !== null) {
        imageCount++;
        const attrs = imgMatch[1] || "";
        
        // Base64 Check
        const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
        const src = srcMatch ? srcMatch[1] : "";
        if (/^data:image\/[^;]+;base64,/i.test(src)) {
            base64Count++;
        }

        // Alt Text Check
        const hasAlt = /alt\s*=\s*["']/i.test(attrs);
        const altMatch = attrs.match(/alt\s*=\s*["']([^"']*)["']/i);
        const altText = altMatch ? altMatch[1].trim() : "";
        if (!hasAlt || altText === "") {
            missingAltCount++;
        } else {
            allAlts.push(altText.toLowerCase());
            
            // Short Alt check
            if (altText.length < 5) {
                shortAltsCount++;
            }
            
            // Generic Alt check
            if (genericWords.some(word => altText.toLowerCase() === word || altText.toLowerCase().includes(" " + word) || altText.toLowerCase().includes(word + " "))) {
                genericAltsCount++;
            }
        }

        // Dimensions Check
        const hasWidth = /width\s*=\s*["']/i.test(attrs);
        const hasHeight = /height\s*=\s*["']/i.test(attrs);
        if (!hasWidth || !hasHeight) {
            missingDimensionsCount++;
        } else {
            const widthMatch = attrs.match(/width\s*=\s*["'](\d+)["']/i);
            const heightMatch = attrs.match(/height\s*=\s*["'](\d+)["']/i);
            const wVal = widthMatch ? parseInt(widthMatch[1], 10) : 0;
            const hVal = heightMatch ? parseInt(heightMatch[1], 10) : 0;
            if (wVal > 1600 || hVal > 1600) {
                oversizedImagesCount++;
            }
        }
    }

    // Find duplicates Alt texts
    const duplicateAlts = allAlts.filter((alt, idx) => allAlts.indexOf(alt) !== idx);

    // 3. Link Analysis
    const linkRegex = /<a\b([^>]*?)>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(content)) !== null) {
        const attrs = linkMatch[1] || "";
        const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
        const href = hrefMatch ? hrefMatch[1].trim() : "";

        const isPlaceholder = !href || 
            href === "#" || 
            href.toLowerCase().startsWith("javascript:") || 
            href.toLowerCase().includes("example.com") || 
            href.toLowerCase().includes("todo.com");

        if (isPlaceholder) {
            brokenLinksCount++;
            brokenLinksList.push(href || "(empty)");
        } else {
            const isInternal = /^\/(?!\/)/.test(href) || 
                href.includes("sharikrasool.com") || 
                href.includes("localhost");
            if (isInternal) {
                internalLinksCount++;
            }
        }
    }

    // 4. Heading Hierarchy Check
    const hierarchyWarnings = validateHeadingHierarchy(content);

    // 5. Deprecated HTML Tag & Attribute Check
    const deprecatedMarkup = detectDeprecatedMarkup(content);
    const deprecatedTagsCount = deprecatedMarkup.tags.length;
    const deprecatedAttrsCount = deprecatedMarkup.attrs.length;
    const deprecatedDetails = [
        ...deprecatedMarkup.tags.map(t => `<${t}> element`),
        ...deprecatedMarkup.attrs.map(a => `${a} attribute`)
    ];

    // 6. Heavy Embed Detection (YouTube, iframes, widgets)
    let heavyEmbedsCount = 0;
    const iframeRegex = /<iframe\b[^>]*>/gi;
    const iframes = content.match(iframeRegex) || [];
    heavyEmbedsCount += iframes.length;

    // Detect third party widget scripts in content
    const scriptRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let scriptMatch;
    let externalScriptsCount = 0;
    while ((scriptMatch = scriptRegex.exec(content)) !== null) {
        const scriptSrc = scriptMatch[1].toLowerCase();
        if (scriptSrc.includes("calendly") || scriptSrc.includes("twitter") || scriptSrc.includes("facebook") || scriptSrc.includes("instagram") || scriptSrc.includes("widget")) {
            heavyEmbedsCount++;
            externalScriptsCount++;
        }
    }

    // 7. Canonical & Metadata Validation against Rendered Output
    let missingCanonical = false;
    let missingMetaDesc = false;
    let missingOgImage = false;

    if (blogMeta) {
        const expectedCanonical = `https://www.sharikrasool.com/blog/${blogMeta.slug}`;
        const canonical = blogMeta.canonicalUrl?.trim() || expectedCanonical;
        if (!canonical || canonical.trim() === "") {
            missingCanonical = true;
        }

        if (!blogMeta.seoDescription || blogMeta.seoDescription.trim() === "") {
            missingMetaDesc = true;
        }

        if (!blogMeta.ogImage && !blogMeta.coverImage) {
            missingOgImage = true;
        }
    } else {
        missingCanonical = true;
        missingMetaDesc = true;
        missingOgImage = true;
    }

    // Rendered Schema Validation
    const missingSchemaProps: string[] = [];
    if (blogMeta) {
        if (!blogMeta.title || blogMeta.title.trim() === "") missingSchemaProps.push("Headline (title)");
        if (!blogMeta.createdAt) missingSchemaProps.push("Published Date (createdAt)");
        if (!blogMeta.updatedAt) missingSchemaProps.push("Modified Date (updatedAt)");
        if (!blogMeta.coverImage && !blogMeta.ogImage) missingSchemaProps.push("Featured Image (coverImage)");
    } else {
        missingSchemaProps.push("Headline (title)", "Published Date (createdAt)", "Modified Date (updatedAt)", "Featured Image (coverImage)");
    }

    // 8. Content Freshness Diagnostics
    let ageInDays = 0;
    if (blogMeta?.updatedAt) {
        const updatedDate = new Date(blogMeta.updatedAt);
        const ageInMs = Date.now() - updatedDate.getTime();
        ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    } else if (blogMeta?.createdAt) {
        const createdDate = new Date(blogMeta.createdAt);
        const ageInMs = Date.now() - createdDate.getTime();
        ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    }

    // 9. Internal Linking & Orphans Detection with exclusions
    let incomingLinksCount = 0;
    let isOrphan = false;
    const internalLinkSuggestions: { title: string; slug: string; matchedPhrase: string }[] = [];

    const slugLower = (blogMeta?.slug || "").toLowerCase();
    const tagsLower = (blogMeta?.tags || []).map(t => t.toLowerCase());
    
    // Exclude landing pages and tool pages based on tags or slug conventions
    const isToolOrLanding = slugLower.includes("-tool") || 
                            slugLower.includes("-calculator") || 
                            slugLower.includes("landing") || 
                            tagsLower.includes("tool") || 
                            tagsLower.includes("landing");
    
    // Exclude newly published posts (published within last 30 days)
    const isNewPost = ageInDays <= 30;

    if (allBlogs && blogMeta?.slug) {
        // Calculate incoming link count from other blogs
        allBlogs.forEach(other => {
            if (other.slug === blogMeta.slug) return;
            const otherContent = other.content || "";
            // Regex to find link pointing to this blog's slug
            const slugLinkRegex = new RegExp(`href=["'][^"']*/blog/${blogMeta.slug}["']`, "i");
            if (slugLinkRegex.test(otherContent)) {
                incomingLinksCount++;
            }
        });

        if (incomingLinksCount === 0) {
            isOrphan = true;
        }

        // Suggestions for internal linking based on keywords in content matching other post titles
        const contentPlain = content.replace(/<[^>]*>?/gm, " ").toLowerCase();
        
        for (const other of allBlogs) {
            if (other.slug === blogMeta.slug) continue;
            if (currentBlogId && other._id === currentBlogId) continue;
            
            // Check if we are already linking to it
            const linksToOtherRegex = new RegExp(`href=["'][^"']*/blog/${other.slug}["']`, "i");
            if (linksToOtherRegex.test(content)) continue;

            // Tokenise other blog title into keywords
            const keywords = other.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .split(/\s+/)
                .filter(word => word.length >= 5)
                // Filter out common stop words
                .filter(word => !["should", "about", "their", "there", "these", "those", "would", "could"].includes(word));
            
            for (const keyword of keywords) {
                // Check if the keyword exists in our content as a standalone word/phrase
                const keywordRegex = new RegExp(`\\b${keyword}\\b`, "i");
                if (keywordRegex.test(contentPlain)) {
                    internalLinkSuggestions.push({
                        title: other.title,
                        slug: other.slug,
                        matchedPhrase: keyword
                    });
                    break; // Move to next blog suggestion
                }
            }

            if (internalLinkSuggestions.length >= 3) break; // Limit suggestions
        }
    }

    // 10. Rebalanced SEO Health Score Calculation
    // Base is 100
    let deductions = 0;

    // Crawl size problems
    if (contentSize > 1.5 * 1024 * 1024) deductions += 50; // Extremely large (critical)
    else if (contentSize > 500 * 1024) deductions += 20;   // Warning

    // Base64 images
    deductions += base64Count * 50;

    // Heading structure
    deductions += emptyHeadingsCount * 10;
    deductions += imageHeadingsCount * 10;
    deductions += missingIdsCount * 2;
    deductions += hierarchyWarnings.length * 2;
    deductions += malformedHeadingsCount * 5;

    // Image SEO
    deductions += missingAltCount * 10;
    deductions += missingDimensionsCount * 2;
    deductions += shortAltsCount * 2;
    deductions += genericAltsCount * 2;

    // Broken links
    deductions += brokenLinksCount * 15;

    // Metadata checklist
    if (missingCanonical) deductions += 15;
    if (missingMetaDesc) deductions += 15;
    if (missingOgImage) deductions += 5;

    // Schema checklist
    deductions += missingSchemaProps.length * 10;

    // Orphan status (only if NOT excluded)
    if (isOrphan && !isToolOrLanding && !isNewPost) {
        deductions += 5;
    }

    const seoHealthScore = Math.max(0, 100 - deductions);

    // Compile Warning Messages
    const messages: string[] = [];
    let status: "safe" | "warning" | "critical" = "safe";

    if (base64Count > 0) {
        status = "critical";
        messages.push(`Embedded Base64 images detected (${base64Count} found). Please upload the image instead.`);
    }

    if (brokenLinksCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Broken or placeholder links found (${brokenLinksCount} found).`);
    }

    if (missingAltCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Images missing alt text attribute (${missingAltCount} found).`);
    }

    if (emptyHeadingsCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Empty headings detected (${emptyHeadingsCount} headings).`);
    }

    if (imageHeadingsCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Image-only headings detected (${imageHeadingsCount} headings).`);
    }

    if (missingIdsCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Headings missing ID attributes (${missingIdsCount} headings).`);
    }

    if (malformedHeadingsCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(...malformedHeadingsList);
    }

    if (hierarchyWarnings.length > 0) {
        if (status !== "critical") status = "warning";
        messages.push(...hierarchyWarnings);
    }

    // Metadata & Schema Warnings
    if (missingCanonical) {
        if (status !== "critical") status = "warning";
        messages.push(`Canonical URL is missing or does not match the rendered URL output format.`);
    }
    if (missingMetaDesc) {
        if (status !== "critical") status = "warning";
        messages.push(`SEO meta description is missing or empty.`);
    }
    if (missingSchemaProps.length > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Missing properties for search engine structured data (Article schema): ${missingSchemaProps.join(", ")}.`);
    }

    // Freshness Audit
    if (ageInDays > 180) {
        if (status !== "critical") status = "warning";
        messages.push(`Content Freshness Alert: This article was last updated ${ageInDays} days ago (exceeds 6 months). Consider refreshing to preserve SEO rankings.`);
    }

    // Orphan check
    if (isOrphan && !isToolOrLanding && !isNewPost) {
        if (status !== "critical") status = "warning";
        messages.push(`Orphan post: This article is not linked from any other published blog post.`);
    }

    // Deprecated elements
    if (deprecatedTagsCount > 0 || deprecatedAttrsCount > 0) {
        if (status !== "critical") status = "warning";
        messages.push(`Deprecated HTML elements detected (${deprecatedDetails.join(", ")}). Clean HTML structure is recommended.`);
    }

    // Size Checks
    const KB = 1024;
    const MB = 1024 * KB;

    if (contentSize > 5 * MB) {
        status = "critical";
        messages.push(`Content size is extremely large (${(contentSize / MB).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
    } else if (contentSize > 1.5 * MB) {
        if (status !== "critical") status = "warning";
        messages.push(`Strong Warning: Content size is ${(contentSize / MB).toFixed(2)} MB. This page is close to Googlebot's 2 MB crawl limit.`);
    } else if (contentSize > 500 * KB) {
        if (status !== "critical") status = "warning";
        messages.push(`Warning: Content size is ${(contentSize / KB).toFixed(1)} KB. Keep it under 500 KB for optimal crawl speed.`);
    }

    // Estimated rendered page size overhead (content + template overhead approx 35KB)
    const renderedContentSize = contentSize + (35 * 1024);
    const imagePayloadEstimate = imageCount * 200 * 1024; // estimate 200KB per image average

    return {
        contentSize,
        imageCount,
        base64Count,
        headingsCount,
        emptyHeadingsCount,
        imageHeadingsCount,
        missingIdsCount,
        missingAltCount,
        missingDimensionsCount,
        internalLinksCount,
        brokenLinksCount,
        brokenLinksList,
        seoHealthScore,
        hierarchyWarnings,
        status,
        messages,

        // Phase 2
        malformedHeadingsCount,
        malformedHeadingsList,
        missingCanonical,
        missingMetaDesc,
        missingOgImage,
        missingSchemaProps,
        duplicateAlts,
        shortAltsCount,
        genericAltsCount,
        oversizedImagesCount,
        deprecatedTagsCount,
        deprecatedAttrsCount,
        deprecatedDetails,
        heavyEmbedsCount,
        incomingLinksCount,
        isOrphan,
        internalLinkSuggestions,
        ageInDays,
        renderedContentSize,
        imagePayloadEstimate,
        externalScriptsCount
    };
}
