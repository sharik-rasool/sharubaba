export interface TocItem {
    id: string;
    text: string;
    level: number;
    children: TocItem[];
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function parseHtmlForToc(html: string): { toc: TocItem[], html: string, headingCount: number } {
    const toc: TocItem[] = [];
    const usedIds = new Set<string>();
    let headingCount = 0;

    // Process Headings
    let modifiedHtml = html.replace(/<(h[23])(.*?)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
        headingCount++;
        
        // Strip HTML tags from content to get plain text for the slug and TOC
        const text = content.replace(/<[^>]*>?/gm, '').trim();
        let id = slugify(text);
        if (!id) id = 'section';
        
        // Handle duplicate IDs
        const originalId = id;
        let counter = 1;
        while (usedIds.has(id)) {
            id = `${originalId}-${counter}`;
            counter++;
        }
        usedIds.add(id);

        const level = tag.toLowerCase() === 'h2' ? 2 : 3;
        const item: TocItem = { id, text, level, children: [] };
        
        if (level === 2) {
            toc.push(item);
        } else if (level === 3) {
            if (toc.length > 0) {
                toc[toc.length - 1].children.push(item);
            } else {
                toc.push(item);
            }
        }

        return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
    });

    // Process Images for Performance (Lazy Loading & Async Decoding)
    modifiedHtml = modifiedHtml.replace(/<img\s([^>]*?)>/gi, (match, attrs) => {
        let newAttrs = attrs;
        if (!/loading=["']/.test(newAttrs)) newAttrs = `${newAttrs} loading="lazy"`;
        if (!/decoding=["']/.test(newAttrs)) newAttrs = `${newAttrs} decoding="async"`;
        return `<img ${newAttrs}>`;
    });

    return {
        toc,
        html: modifiedHtml,
        headingCount
    };
}
