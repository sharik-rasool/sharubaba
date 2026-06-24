import React from "react";
import { unstable_cache } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const cache = <T extends Function>(fn: T): T => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (React as any).cache ? (React as any).cache(fn) : fn;
};

// A safe unstable_cache wrapper that falls back to the original function if executed outside Next.js runtime (e.g., in scripts).
export function safeCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyParts: string[],
    options?: { revalidate?: number; tags?: string[] }
): T {
    const cachedFn = unstable_cache(fn, keyParts, options);
    const wrapper = (async (...args: any[]) => {
        try {
            return await cachedFn(...args);
        } catch (e: any) {
            if (e && (e.message?.includes("incrementalCache") || e.message?.includes("Invariant"))) {
                return await fn(...args);
            }
            throw e;
        }
    }) as unknown as T;
    return wrapper;
}

import connectDB from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";

export type BlogDoc = {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    tags: string[];
    faqs: { question: string; answer: string }[];
    status: "draft" | "published";
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    robotsMeta: string;
    ogImage: string;
    scheduledFor?: string;
    viewCount: number;
    readingTime: number;
    createdAt: string;
    updatedAt: string;

    // SEO Automation fields
    aiGenerated?: boolean;
    freshnessCheckedAt?: string;
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    anchors?: string[];
    embeddings?: number[];
    topicClusterId?: string;
    pillarPageSlug?: string;
    contentBrief?: {
        intent: string;
        primaryKeyword: string;
        secondaryKeywords: string[];
        competitorHeadings: string[];
        paaQuestions: string[];
        entities: string[];
    };
    qaReport?: {
        wordCount: number;
        headingCounts: Record<string, number>;
        internalLinkCount: number;
        primaryKeywordPresence: boolean;
        metaTitleLength: number;
        metaDescriptionLength: number;
        status: "passed" | "warned" | "failed";
    };
};

function serialize(doc: IBlog): BlogDoc {
    const obj = doc.toObject ? doc.toObject() : doc;
    
    // Safely parse date
    let scheduledForStr: string | undefined = undefined;
    if (obj.scheduledFor) {
        const d = new Date(obj.scheduledFor);
        if (!isNaN(d.getTime())) {
            scheduledForStr = d.toISOString();
        }
    }

    return {
        _id: obj._id.toString(),
        title: obj.title || "",
        slug: obj.slug || "",
        content: obj.content || "",
        excerpt: obj.excerpt || "",
        coverImage: obj.coverImage || "",
        tags: Array.isArray(obj.tags) ? obj.tags : [],
        faqs: Array.isArray(obj.faqs) 
            ? obj.faqs.map((f: Record<string, unknown>) => ({ 
                question: String(f?.question || ""), 
                answer: String(f?.answer || "") 
              })) 
            : [],
        status: obj.status || "draft",
        seoTitle: obj.seoTitle || "",
        seoDescription: obj.seoDescription || "",
        canonicalUrl: obj.canonicalUrl || "",
        robotsMeta: obj.robotsMeta || "index, follow",
        ogImage: obj.ogImage || "",
        scheduledFor: scheduledForStr,
        viewCount: typeof obj.viewCount === 'number' ? obj.viewCount : 0,
        readingTime: typeof obj.readingTime === 'number' ? obj.readingTime : 0,
        createdAt: (obj.createdAt instanceof Date) ? obj.createdAt.toISOString() : String(obj.createdAt || ""),
        updatedAt: (obj.updatedAt instanceof Date) ? obj.updatedAt.toISOString() : String(obj.updatedAt || ""),

        aiGenerated: !!obj.aiGenerated,
        freshnessCheckedAt: obj.freshnessCheckedAt instanceof Date ? obj.freshnessCheckedAt.toISOString() : undefined,
        primaryKeyword: obj.primaryKeyword || "",
        secondaryKeywords: Array.isArray(obj.secondaryKeywords) ? obj.secondaryKeywords : [],
        anchors: Array.isArray(obj.anchors) ? obj.anchors : [],
        embeddings: Array.isArray(obj.embeddings) ? obj.embeddings : [],
        topicClusterId: obj.topicClusterId || "",
        pillarPageSlug: obj.pillarPageSlug || "",
        contentBrief: obj.contentBrief ? {
            intent: obj.contentBrief.intent || "",
            primaryKeyword: obj.contentBrief.primaryKeyword || "",
            secondaryKeywords: Array.isArray(obj.contentBrief.secondaryKeywords) ? obj.contentBrief.secondaryKeywords : [],
            competitorHeadings: Array.isArray(obj.contentBrief.competitorHeadings) ? obj.contentBrief.competitorHeadings : [],
            paaQuestions: Array.isArray(obj.contentBrief.paaQuestions) ? obj.contentBrief.paaQuestions : [],
            entities: Array.isArray(obj.contentBrief.entities) ? obj.contentBrief.entities : []
        } : undefined,
        qaReport: obj.qaReport ? {
            wordCount: typeof obj.qaReport.wordCount === "number" ? obj.qaReport.wordCount : 0,
            headingCounts: obj.qaReport.headingCounts instanceof Map 
                ? Object.fromEntries(obj.qaReport.headingCounts) 
                : (obj.qaReport.headingCounts || {}),
            internalLinkCount: typeof obj.qaReport.internalLinkCount === "number" ? obj.qaReport.internalLinkCount : 0,
            primaryKeywordPresence: !!obj.qaReport.primaryKeywordPresence,
            metaTitleLength: typeof obj.qaReport.metaTitleLength === "number" ? obj.qaReport.metaTitleLength : 0,
            metaDescriptionLength: typeof obj.qaReport.metaDescriptionLength === "number" ? obj.qaReport.metaDescriptionLength : 0,
            status: obj.qaReport.status || "failed"
        } : undefined
    };
}

async function db() {
    const conn = await connectDB();
    if (!conn) throw new Error("No database connection");
}

export const getPublishedBlogs = safeCache(
    async (): Promise<BlogDoc[]> => {
        try {
            await db();
            const now = new Date();
            const blogs = await Blog.find({ 
                $or: [
                    {
                        status: "published",
                        $or: [{ scheduledFor: { $lte: now } }, { scheduledFor: { $exists: false } }, { scheduledFor: null }]
                    },
                    {
                        status: "draft",
                        scheduledFor: { $lte: now }
                    }
                ]
            })
                .select("title slug excerpt coverImage tags readingTime createdAt status scheduledFor updatedAt")
                .sort({ createdAt: -1 })
                .lean<IBlog[]>();
            return blogs.map((b) => serialize(b as unknown as IBlog));
        } catch {
            return [];
        }
    },
    ["published-blogs"],
    { revalidate: 3600, tags: ["blogs"] }
);

export const getAllBlogs = cache(async (): Promise<BlogDoc[]> => {
    try {
        await db();
        const blogs = await Blog.find({}).select("-content -embeddings").sort({ createdAt: -1 }).lean<IBlog[]>();
        return blogs.map((b) => serialize(b as unknown as IBlog));
    } catch {
        return [];
    }
});

export async function getBlogLinkStats(): Promise<{ id: string; internal: number; external: number }[]> {
    try {
        await db();
        const blogs = await Blog.find({}).select("_id content").lean<{ _id: string, content: string }[]>();
        
        const SITE_HOST = "sharikrasool.com";
        const hrefRe = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi;
        
        return blogs.map(b => {
            let internal = 0;
            let external = 0;
            let match: RegExpExecArray | null;
            const content = b.content || "";
            
            while ((match = hrefRe.exec(content)) !== null) {
                const href = match[1];
                if (href.startsWith("/") || href.startsWith("#")) {
                    internal++;
                } else {
                    try {
                        const url = new URL(href);
                        if (url.hostname === SITE_HOST || url.hostname === `www.${SITE_HOST}`) {
                            internal++;
                        } else {
                            external++;
                        }
                    } catch {
                        internal++; // If parsing fails, assume it's a relative/internal malformed link
                    }
                }
            }
            return { id: b._id.toString(), internal, external };
        });
    } catch {
        return [];
    }
}

export const getBlogBySlug = cache(async (slug: string): Promise<BlogDoc | null> => {
    try {
        const fetchBlog = safeCache(
            async (s: string) => {
                await db();
                const blog = await Blog.findOne({ slug: s }).select("-embeddings -contentBrief -qaReport").lean<IBlog>();
                if (!blog) return null;
                return serialize(blog as unknown as IBlog);
            },
            [`blog-slug-${slug}`],
            { revalidate: 3600, tags: [`blog-slug-${slug}`, "blogs"] }
        );
        return await fetchBlog(slug);
    } catch {
        return null;
    }
});

export const getBlogById = cache(async (id: string): Promise<BlogDoc | null> => {
    try {
        await db();
        const blog = await Blog.findById(id).select("-embeddings").lean<IBlog>();
        if (!blog) return null;
        return serialize(blog as unknown as IBlog);
    } catch {
        return null;
    }
});
