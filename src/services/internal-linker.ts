import { parse } from "node-html-parser";

export interface LinkInventoryItem {
    slug: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    anchors: string[];
}

interface LinkerContext {
    totalLinksInserted: number;
    maxLinks: number;
    h2SectionLinksCount: number;
    currentH2Title: string;
    currentSlug: string;
    mapping: { anchor: string; slug: string }[];
}

interface HTMLNode {
    nodeType: number;
    tagName: string;
    text: string;
    rawText: string;
    childNodes: HTMLNode[];
    parentNode: HTMLNode | null;
}

/**
 * Traverse the DOM tree recursively and linkify matching text nodes
 */
function traverse(node: HTMLNode, ctx: LinkerContext) {
    if (node.nodeType === 1) { // Element Node
        const tagName = (node.tagName || "").toLowerCase();
        
        // If we hit an H2 tag, reset the H2 section link limit counter
        if (tagName === "h2") {
            ctx.h2SectionLinksCount = 0;
            ctx.currentH2Title = node.text || "";
            return; // Do not traverse the text inside the heading itself
        }
        
        // Exclude headings, existing links, captions, and code blocks from being linked
        if (["a", "h1", "h2", "h3", "h4", "h5", "h6", "figcaption", "code", "pre"].includes(tagName)) {
            return;
        }
        
        // Copy childNodes array to prevent index-shifting issues during DOM splice modifications
        const children = [...node.childNodes];
        for (const child of children) {
            traverse(child, ctx);
        }
    } else if (node.nodeType === 3) { // Text Node
        if (ctx.totalLinksInserted >= ctx.maxLinks) {
            return;
        }
        if (ctx.h2SectionLinksCount >= 1) {
            // Density limit: Max 1 link per H2 section
            return;
        }
        
        const text = node.rawText;
        if (!text || text.trim().length === 0) return;
        
        // Walk sorted anchors (longest-match-first)
        for (const item of ctx.mapping) {
            // Self-linking protection
            if (item.slug === ctx.currentSlug) {
                continue;
            }
            
            // Escape regex chars
            const escapedAnchor = item.anchor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Match complete word anchors case-insensitively using word boundaries
            const regex = new RegExp(`\\b(${escapedAnchor})\\b`, 'i');
            const match = text.match(regex);
            
            if (match && match.index !== undefined) {
                const matchedText = match[0];
                const matchIndex = match.index;
                
                const beforeText = text.substring(0, matchIndex);
                const afterText = text.substring(matchIndex + matchedText.length);
                
                const parent = node.parentNode;
                if (!parent) continue;
                
                const idx = parent.childNodes.indexOf(node);
                if (idx === -1) continue;
                
                // Create replacements using node-html-parser fragments
                const replacements: HTMLNode[] = [];
                if (beforeText) {
                    const beforeNode = parse(beforeText).childNodes[0] as unknown as HTMLNode;
                    if (beforeNode) replacements.push(beforeNode);
                }
                
                const linkNode = parse(`<a href="/blog/${item.slug}">${matchedText}</a>`).childNodes[0] as unknown as HTMLNode;
                if (linkNode) replacements.push(linkNode);
                
                if (afterText) {
                    const afterNode = parse(afterText).childNodes[0] as unknown as HTMLNode;
                    if (afterNode) replacements.push(afterNode);
                }
                
                // Splice current node with linked node sequence
                parent.childNodes.splice(idx, 1, ...replacements);
                
                ctx.totalLinksInserted++;
                ctx.h2SectionLinksCount++;
                
                // Recursively traverse before and after fragments for other keywords
                // (This naturally avoids overlapping matches since matchedText is excluded)
                replacements.forEach(repNode => {
                    if (repNode && repNode.nodeType === 3) {
                        traverse(repNode, ctx);
                    }
                });
                
                // Stop matching once this text node has been split
                break;
            }
        }
    }
}

/**
 * Main internal linker utility
 */
export function linkifyHtml(
    htmlContent: string,
    currentSlug: string,
    linkInventory: LinkInventoryItem[],
    maxLinks: number = 8
): string {
    if (!htmlContent) return "";
    
    // Compile and flat mapping of anchor -> slug
    const flatMapping: { anchor: string; slug: string }[] = [];
    linkInventory.forEach((item) => {
        const uniqueAnchors = new Set<string>();
        if (item.primaryKeyword) {
            uniqueAnchors.add(item.primaryKeyword.trim().toLowerCase());
        }
        if (item.secondaryKeywords) {
            item.secondaryKeywords.forEach(k => {
                if (k) uniqueAnchors.add(k.trim().toLowerCase());
            });
        }
        if (item.anchors) {
            item.anchors.forEach(a => {
                if (a) uniqueAnchors.add(a.trim().toLowerCase());
            });
        }
        
        uniqueAnchors.forEach((anchor) => {
            if (anchor.length > 2) { // Skip trivial short abbreviations
                flatMapping.push({ anchor, slug: item.slug });
            }
        });
    });

    // Sort mapping by length descending (longest-match-first strategy)
    flatMapping.sort((a, b) => b.anchor.length - a.anchor.length);

    // Parse HTML root
    const root = parse(htmlContent);
    const ctx: LinkerContext = {
        totalLinksInserted: 0,
        maxLinks,
        h2SectionLinksCount: 0,
        currentH2Title: "",
        currentSlug,
        mapping: flatMapping
    };

    // Run DFS traversal
    traverse(root as unknown as HTMLNode, ctx);

    return root.toString();
}
