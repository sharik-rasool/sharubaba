/**
 * Shared utility for auditing blog post content size, images, and base64 detection.
 */

export interface ContentHealth {
    contentSize: number;       // Size in bytes
    imageCount: number;        // Total <img> tags
    base64Count: number;       // Total base64 images
    status: "safe" | "warning" | "critical";
    messages: string[];
}

export function scanContentHealth(content: string = ""): ContentHealth {
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

    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let imageCount = 0;
    let base64Count = 0;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
        imageCount++;
        const src = match[1] || "";
        if (/^data:image\/[^;]+;base64,/i.test(src)) {
            base64Count++;
        }
    }

    const messages: string[] = [];
    let status: "safe" | "warning" | "critical" = "safe";

    // 1. Base64 Check
    if (base64Count > 0) {
        status = "critical";
        messages.push(`Embedded Base64 images detected (${base64Count} found). Please upload the image instead.`);
    }

    // 2. Size Checks
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

    return {
        contentSize,
        imageCount,
        base64Count,
        status,
        messages,
    };
}
