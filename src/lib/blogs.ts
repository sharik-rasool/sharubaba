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
    };
}

async function db() {
    const conn = await connectDB();
    if (!conn) throw new Error("No database connection");
}

export async function getPublishedBlogs(): Promise<BlogDoc[]> {
    try {
        await db();
        const now = new Date();
        const blogs = await Blog.find({ 
            status: "published",
            $or: [{ scheduledFor: { $lte: now } }, { scheduledFor: { $exists: false } }, { scheduledFor: null }]
        })
            .select("-content")
            .sort({ createdAt: -1 })
            .lean<IBlog[]>();
        return blogs.map((b) => serialize(b as unknown as IBlog));
    } catch {
        return [];
    }
}

export async function getAllBlogs(): Promise<BlogDoc[]> {
    try {
        await db();
        const blogs = await Blog.find({}).select("-content").sort({ createdAt: -1 }).lean<IBlog[]>();
        return blogs.map((b) => serialize(b as unknown as IBlog));
    } catch {
        return [];
    }
}

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

export async function getBlogBySlug(slug: string): Promise<BlogDoc | null> {
    try {
        await db();
        const blog = await Blog.findOne({ slug }).lean<IBlog>();
        if (!blog) return null;
        return serialize(blog as unknown as IBlog);
    } catch {
        return null;
    }
}

export async function getBlogById(id: string): Promise<BlogDoc | null> {
    try {
        await db();
        const blog = await Blog.findById(id).lean<IBlog>();
        if (!blog) return null;
        return serialize(blog as unknown as IBlog);
    } catch {
        return null;
    }
}
