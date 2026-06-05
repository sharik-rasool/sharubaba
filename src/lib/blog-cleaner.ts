import { slugify } from "./toc";

// Re-export slugify for convenience
export { slugify };

/**
 * Standardizes and cleans HTML pasted from external editors like Google Docs, Word, or ChatGPT.
 * It removes style blocks, inline style attributes, non-semantic wrapper tags, and duplicate spacing.
 */
export function cleanHtmlForPaste(html: string): string {
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

    // 4. Strip specific inline CSS properties from style="..." attributes:
    // font-family, font-size, color, margin, padding, line-height, text-indent.
    // Also remove Google Docs/Word specific attributes like docs-internal-guid.
    cleaned = cleaned.replace(/docs-internal-guid="[^"]*"/gi, "");
    cleaned = cleaned.replace(/id="docs-internal-guid-[^"]*"/gi, "");
    cleaned = cleaned.replace(/class="[^"]*"/gi, ""); // Strip custom classes from external sources

    // Strip style attributes entirely, as we want to rely on the CSS theme
    // We only preserve style if it is specifically text-align (to keep paragraph alignments)
    cleaned = cleaned.replace(/style="([^"]*)"/gi, (match, styleContent: string) => {
        const alignMatch = styleContent.match(/text-align\s*:\s*(left|center|right|justify)/i);
        return alignMatch ? `style="text-align: ${alignMatch[1].toLowerCase()};"` : "";
    });

    // 5. Clean other non-safe attributes from tags except target attributes (href, src, alt, width, height)
    cleaned = cleaned.replace(/<([a-z1-6]+)\b([^>]*)>/gi, (match, tag: string, attrs: string) => {
        const lowerTag = tag.toLowerCase();
        if (["a", "img", "iframe", "td", "th", "table"].includes(lowerTag)) {
            // Keep specific allowed attributes
            const allowed: string[] = [];
            
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

        // For all other tags, strip everything except text-align style
        const styleMatch = attrs.match(/style="([^"]*)"/i);
        return `<${tag}${styleMatch ? ` style="${styleMatch[1]}"` : ""}>`;
    });

    // 6. Remove empty semantic tags recursively (p, h1-h6, blockquote, li, ul, ol)
    do {
        prev = cleaned;
        cleaned = cleaned.replace(/<(p|h[1-6]|blockquote|li|ul|ol)[^>]*>(\s*|&nbsp;)*<\/\1>/gi, "");
    } while (cleaned !== prev);

    return cleaned.trim();
}

/**
 * Strips all inline styles from HTML content.
 */
export function sanitizeContent(html: string): string {
    return cleanHtmlForPaste(html);
}

/**
 * Converts image-only headings (headings that wrap an <img> tag and nothing else)
 * into semantic `<figure>` tags.
 */
export function convertImageHeadings(html: string): string {
    if (!html) return "";
    
    // Match heading tags containing only an img tag (with optional space/attributes)
    // Matches <h2><img src="..."></h2> or <h3><img src="..." /></h3> etc.
    return html.replace(/<(h[2-4])\b[^>]*>\s*(<img\b[^>]+>)\s*<\/\1>/gi, (match, tag, imgTag) => {
        return `<figure className="article-image my-6">${imgTag}</figure>`;
    });
}

/**
 * Automatically generates clean, unique URL-safe `id` attributes for all h2, h3, and h4 headings
 * that are missing IDs or have unclean IDs.
 */
export function generateHeadingIds(html: string): string {
    if (!html) return "";

    const usedIds = new Set<string>();

    return html.replace(/<(h[2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, tag, attrs, content) => {
        // Strip tags from heading content to get clean plain text
        const plainText = content.replace(/<[^>]*>?/gm, "").trim();
        
        // Skip empty headings
        if (!plainText) return match;

        // Extract existing ID if present
        let id = "";
        const idMatch = attrs.match(/id="([^"]*)"/i);
        if (idMatch && idMatch[1]) {
            id = slugify(idMatch[1]);
        } else {
            id = slugify(plainText);
        }

        if (!id) id = "section";

        // De-duplicate within the document
        const originalId = id;
        let counter = 1;
        while (usedIds.has(id)) {
            id = `${originalId}-${counter}`;
            counter++;
        }
        usedIds.add(id);

        // Remove any existing id from attributes
        const cleanedAttrs = attrs.replace(/\sid="[^"]*"/gi, "").trim();

        return `<${tag}${cleanedAttrs ? " " + cleanedAttrs : ""} id="${id}">${content}</${tag}>`;
    });
}

/**
 * Audits the heading structure of the HTML content.
 * Identifies jumps (e.g. H2 followed directly by H4 without an H3, or H1 in content).
 * Returns an array of warning strings.
 */
export function validateHeadingHierarchy(html: string): string[] {
    const warnings: string[] = [];
    if (!html) return warnings;

    // Find all headings in source order
    const headings: { tag: string; text: string }[] = [];
    const headingRegex = /<(h[1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const tag = match[1].toUpperCase();
        const text = match[2].replace(/<[^>]*>?/gm, "").trim();
        headings.push({ tag, text });
    }

    let lastLevel = 1; // H1 is baseline (usually page title, outside editor)

    headings.forEach((heading) => {
        const level = parseInt(heading.tag.substring(1), 10);

        if (level === 1) {
            warnings.push(`Warning: Multiple H1 headings found. Heading "${heading.text}" should be changed to H2.`);
        } else if (level > lastLevel + 1) {
            warnings.push(`Heading Hierarchy Gap: Heading "${heading.text}" (${heading.tag}) directly follows a higher-level heading without a step-by-step intermediate header (jumped from H${lastLevel} to H${level}).`);
        }

        lastLevel = level;
    });

    return warnings;
}

/**
 * Detects headings that are malformed (e.g. containing block-level elements or excessive length).
 */
export function detectMalformedHeadings(html: string): string[] {
    const warnings: string[] = [];
    if (!html) return warnings;

    const headingRegex = /<(h[2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const tag = match[1].toUpperCase();
        const content = match[2];
        const text = content.replace(/<[^>]*>?/gm, "").trim();

        const hasBr = /<br\s*\/?>/i.test(content);
        const hasBlock = /<(p|div|blockquote|ul|ol|li)\b/i.test(content);

        if (hasBr || hasBlock) {
            warnings.push(`Malformed Heading: Heading ${tag} "${text.substring(0, 40)}..." wraps structural block tags or line breaks.`);
        } else if (text.length > 150) {
            warnings.push(`Extremely Long Heading: Heading ${tag} is unusually long (${text.length} characters) and may contain paragraph content.`);
        }
    }

    return warnings;
}

/**
 * Repairs malformed headings only if block-level elements or line breaks are found inside them.
 */
export function repairMalformedHeadings(html: string): string {
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

/**
 * Scans HTML content for deprecated HTML elements and presentational attributes.
 */
export function detectDeprecatedMarkup(html: string): { tags: string[]; attrs: string[] } {
    const tags: string[] = [];
    const attrs: string[] = [];
    if (!html) return { tags, attrs };

    const tagRegex = /<([a-z1-6]+)\b([^>]*)>/gi;
    let match;
    const deprecatedTagsList = ["font", "center", "u", "strike", "s", "big", "dir", "applet", "basefont", "tt"];
    const deprecatedAttrsList = ["align", "bgcolor", "border", "color", "face", "size"];

    while ((match = tagRegex.exec(html)) !== null) {
        const tagName = match[1].toLowerCase();
        const tagAttrs = match[2] || "";

        if (deprecatedTagsList.includes(tagName)) {
            tags.push(tagName);
        }

        deprecatedAttrsList.forEach(attr => {
            const attrRegex = new RegExp(`\\b${attr}\\s*=`, "i");
            if (attrRegex.test(tagAttrs)) {
                attrs.push(`${attr} in <${tagName}>`);
            }
        });
    }

    return { tags, attrs };
}
