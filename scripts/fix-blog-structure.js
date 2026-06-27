import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const BlogSchema = new mongoose.Schema(
    {
        title: String,
        slug: String,
        content: String,
        status: String,
    },
    { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// --- Content Cleaning Utilities (Replicated for self-contained Node execution) ---

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function convertImageHeadings(html) {
    if (!html) return "";
    return html.replace(/<(h[2-4])\b[^>]*>\s*(<img\b[^>]+>)\s*<\/\1>/gi, (match, tag, imgTag) => {
        return `<figure className="article-image my-6">${imgTag}</figure>`;
    });
}

function repairMalformedHeadings(html) {
    if (!html) return "";

    return html.replace(/<(h[2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, tag, attrs, content) => {
        const hasBr = /<br\s*\/?>/i.test(content);
        const hasBlock = /<(p|div|blockquote|ul|ol|li)\b/i.test(content);
        if (!hasBr && !hasBlock) return match;

        if (hasBr) {
            const parts = content.split(/<br\s*\/?>/i);
            const headingContent = parts[0].replace(/<[^>]*>?/gm, "").trim();
            const remainder = parts.slice(1).join("<br>").trim();
            if (headingContent && remainder) {
                const cleanAttrs = attrs.replace(/\sid="[^"]*"/gi, "").trim();
                const newId = slugify(headingContent);
                return `<${tag}${cleanAttrs ? " " + cleanAttrs : ""} id="${newId}">${parts[0]}</${tag}>\n<p>${remainder}</p>`;
            }
        }

        if (hasBlock) {
            const blockRegex = /<((?:p|div|blockquote|ul|ol|li))\b([^>]*)>([\s\S]*?)<\/\1>/i;
            const blockMatch = content.match(blockRegex);
            if (blockMatch) {
                const blockIndex = content.indexOf(blockMatch[0]);
                const beforeText = content.substring(0, blockIndex).replace(/<[^>]*>?/gm, "").trim();
                const blockContent = content.substring(blockIndex);
                if (beforeText) {
                    const cleanAttrs = attrs.replace(/\sid="[^"]*"/gi, "").trim();
                    const newId = slugify(beforeText);
                    return `<${tag}${cleanAttrs ? " " + cleanAttrs : ""} id="${newId}">${beforeText}</${tag}>\n${blockContent}`;
                } else {
                    return blockContent; // Unwrap heading completely
                }
            }
        }

        return match;
    });
}

function cleanHtmlForPaste(html) {
    if (!html) return "";

    let cleaned = html;

    // 1. Remove script, style, and meta tags completely
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    cleaned = cleaned.replace(/<meta[^>]*>/gi, "");

    // 2. Unwrap <span> tags recursively, keeping their inner content
    let prev;
    do {
        prev = cleaned;
        cleaned = cleaned.replace(/<span\b[^>]*>([\s\S]*?)<\/span>/gi, "$1");
    } while (cleaned !== prev);

    // 3. Convert image-only headings into figures
    cleaned = convertImageHeadings(cleaned);

    // 3.5. Repair malformed headings with inline block structures
    cleaned = repairMalformedHeadings(cleaned);

    // 4. Strip specific inline CSS properties from style="..." attributes
    cleaned = cleaned.replace(/docs-internal-guid="[^"]*"/gi, "");
    cleaned = cleaned.replace(/id="docs-internal-guid-[^"]*"/gi, "");
    cleaned = cleaned.replace(/class="[^"]*"/gi, ""); // Strip custom classes from external sources

    cleaned = cleaned.replace(/style="([^"]*)"/gi, (match, styleContent) => {
        const alignMatch = styleContent.match(/text-align\s*:\s*(left|center|right|justify)/i);
        return alignMatch ? `style="text-align: ${alignMatch[1].toLowerCase()};"` : "";
    });

    // 5. Clean other non-safe attributes from tags except target attributes (href, src, alt, width, height)
    cleaned = cleaned.replace(/<([a-z1-6]+)\b([^>]*)>/gi, (match, tag, attrs) => {
        const lowerTag = tag.toLowerCase();
        if (["a", "img", "iframe", "td", "th", "table"].includes(lowerTag)) {
            const allowed = [];
            
            if (lowerTag === "a") {
                const hrefMatch = attrs.match(/href="([^"]*)"/i);
                const targetMatch = attrs.match(/target="([^"]*)"/i);
                const relMatch = attrs.match(/rel="([^"]*)"/i);
                if (hrefMatch) allowed.push(`href="${hrefMatch[1]}"`);
                if (targetMatch) allowed.push(`target="${targetMatch[1]}"`);
                if (relMatch) allowed.push(`rel="${relMatch[1]}"`);
            }
            
            if (lowerTag === "img") {
                const srcMatch = attrs.match(/src="([^"]*)"/i);
                const altMatch = attrs.match(/alt="([^"]*)"/i);
                const widthMatch = attrs.match(/width="([^"]*)"/i);
                const heightMatch = attrs.match(/height="([^"]*)"/i);
                const loadingMatch = attrs.match(/loading="([^"]*)"/i);
                const decodingMatch = attrs.match(/decoding="([^"]*)"/i);
                if (srcMatch) allowed.push(`src="${srcMatch[1]}"`);
                if (altMatch) allowed.push(`alt="${altMatch[1]}"`);
                if (widthMatch) allowed.push(`width="${widthMatch[1]}"`);
                if (heightMatch) allowed.push(`height="${heightMatch[1]}"`);
                if (loadingMatch) allowed.push(`loading="${loadingMatch[1]}"`);
                if (decodingMatch) allowed.push(`decoding="${decodingMatch[1]}"`);
            }

            if (["td", "th"].includes(lowerTag)) {
                const colspan = attrs.match(/colspan="([^"]*)"/i);
                const rowspan = attrs.match(/rowspan="([^"]*)"/i);
                if (colspan) allowed.push(`colspan="${colspan[1]}"`);
                if (rowspan) allowed.push(`rowspan="${rowspan[1]}"`);
            }

            const styleMatch = attrs.match(/style="([^"]*)"/i);
            if (styleMatch) allowed.push(`style="${styleMatch[1]}"`);

            return `<${tag}${allowed.length > 0 ? " " + allowed.join(" ") : ""}>`;
        }

        const styleMatch = attrs.match(/style="([^"]*)"/i);
        return `<${tag}${styleMatch ? ` style="${styleMatch[1]}"` : ""}>`;
    });

    // 6. Remove empty semantic tags recursively (p, h1-h6, blockquote, li, ul, ol, a)
    do {
        prev = cleaned;
        cleaned = cleaned.replace(/<(p|h[1-6]|blockquote|li|ul|ol|a)[^>]*>(\s*|&nbsp;)*<\/\1>/gi, "");
    } while (cleaned !== prev);

    return cleaned.trim();
}

function generateHeadingIds(html) {
    if (!html) return "";
    const usedIds = new Set();

    return html.replace(/<(h[2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, tag, attrs, content) => {
        const plainText = content.replace(/<[^>]*>?/gm, "").trim();
        if (!plainText) return match;

        let id = "";
        const idMatch = attrs.match(/id="([^"]*)"/i);
        if (idMatch && idMatch[1]) {
            id = slugify(idMatch[1]);
        } else {
            id = slugify(plainText);
        }

        if (!id) id = "section";

        const originalId = id;
        let counter = 1;
        while (usedIds.has(id)) {
            id = `${originalId}-${counter}`;
            counter++;
        }
        usedIds.add(id);

        const cleanedAttrs = attrs.replace(/\sid="[^"]*"/gi, "").trim();
        return `<${tag}${cleanedAttrs ? " " + cleanedAttrs : ""} id="${id}">${content}</${tag}>`;
    });
}

// --- Main Execution Script ---

async function run() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined in .env.local");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully.\n");

        const blogs = await Blog.find({});
        console.log(`Analyzing ${blogs.length} blog posts...\n`);

        let checkedCount = 0;
        let repairedCount = 0;

        for (const blog of blogs) {
            checkedCount++;
            const originalContent = blog.content || "";
            
            // Apply cleanup pipeline
            let cleanedContent = cleanHtmlForPaste(originalContent);
            cleanedContent = generateHeadingIds(cleanedContent);

            if (cleanedContent !== originalContent) {
                console.log(`[REPAIR] "${blog.title}"`);
                console.log(`  - Original length: ${originalContent.length} chars`);
                console.log(`  - Cleaned length:  ${cleanedContent.length} chars`);
                
                blog.content = cleanedContent;
                await blog.save();
                repairedCount++;
            } else {
                console.log(`[OK]     "${blog.title}"`);
            }
        }

        console.log("\n==============================================");
        console.log("Migration Summary:");
        console.log(`  - Total Checked:  ${checkedCount}`);
        console.log(`  - Total Repaired: ${repairedCount}`);
        console.log("==============================================");

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB. Done.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

run();
