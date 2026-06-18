import { callGroqWithRetry } from "./ai-generator";

export interface CannibalCheckResult {
    isCannibal: boolean;
    reason?: string;
    similarityScore: number;
}

/**
 * Normalize a keyword by stripping non-alphanumeric chars and making it lowercase
 */
export function normalizeKeyword(keyword: string): string {
    return keyword
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Generate a URL-safe slug from a keyword
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

/**
 * Check if the keyword represents a literal duplicate title, slug, or primary keyword
 */
export function checkKeywordDuplicate(
    keyword: string,
    existingPosts: { title: string; slug: string; primaryKeyword?: string }[]
): { isDuplicate: boolean; type?: "keyword" | "title" | "slug"; matchedWith?: string } {
    const normalizedNew = normalizeKeyword(keyword);
    const slugNew = slugify(keyword);

    for (const post of existingPosts) {
        if (post.primaryKeyword && normalizeKeyword(post.primaryKeyword) === normalizedNew) {
            return { isDuplicate: true, type: "keyword", matchedWith: post.primaryKeyword };
        }
        if (post.title && normalizeKeyword(post.title) === normalizedNew) {
            return { isDuplicate: true, type: "title", matchedWith: post.title };
        }
        if (post.slug && post.slug === slugNew) {
            return { isDuplicate: true, type: "slug", matchedWith: post.slug };
        }
    }

    return { isDuplicate: false };
}

/**
 * Check if the new keyword overlaps semantically with the intent of existing articles
 */
export async function checkCannibalization(
    keyword: string,
    existingPosts: { title: string; primaryKeyword?: string }[]
): Promise<CannibalCheckResult> {
    if (existingPosts.length === 0) {
        return { isCannibal: false, similarityScore: 0 };
    }

    const listToCompare = existingPosts.map(p => ({
        title: p.title,
        primaryKeyword: p.primaryKeyword || ""
    })).slice(0, 100); // Limit database list length to fit easily into model context window

    const prompt = `You are a professional SEO strategist.
We want to write a new article targeting the primary keyword: "${keyword}".
Review our existing published articles:
${JSON.stringify(listToCompare, null, 2)}

Determine if writing this new article will cause keyword cannibalization (i.e. it covers the exact same user search intent, topic, or search query focus as an existing article).
Calculate a similarity score from 0.0 to 1.0 (where 1.0 is a complete duplicate and 0.0 is completely unique).
If the similarity score is >= 0.75, mark "isCannibal": true.

Return a JSON object matching this structure exactly (do not output any markdown code blocks or extra text, just raw JSON):
{
  "isCannibal": true | false,
  "similarityScore": 0.85,
  "reason": "Explanation of which existing post it overlaps with and why (or empty string if false)."
}`;

    try {
        const text = await callGroqWithRetry("llama-3.3-70b-versatile", prompt, true);
        return JSON.parse(text) as CannibalCheckResult;
    } catch (err: unknown) {
        console.error("[CANNIBALIZATION CHECKER] Error running Groq check permanently:", (err as Error).message || err);
        return { isCannibal: false, similarityScore: 0, reason: "Check failed due to API error." };
    }
}
