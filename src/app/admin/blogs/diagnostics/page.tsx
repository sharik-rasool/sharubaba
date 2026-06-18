import connectDB from "@/lib/db";
import Blog, { IBlog } from "@/models/Blog";
import DiagnosticsTable from "@/components/admin/DiagnosticsTable";

export const revalidate = 0; // Disable caching for the diagnostics panel

export default async function DiagnosticsPage() {
    await connectDB();
    const rawBlogs = await Blog.find({}).sort({ createdAt: -1 }).lean<IBlog[]>();
    
    // Serialize database documents cleanly to pass to client component
    const blogs = rawBlogs.map(blog => ({
        _id: String(blog._id),
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        status: blog.status || "draft",
        updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString(),
        createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : new Date().toISOString(),
        seoDescription: blog.seoDescription || "",
        canonicalUrl: blog.canonicalUrl || "",
        ogImage: blog.ogImage || "",
        coverImage: blog.coverImage || "",
        tags: blog.tags || [],
        
        // SEO Automation fields
        aiGenerated: !!blog.aiGenerated,
        primaryKeyword: blog.primaryKeyword || "",
        secondaryKeywords: blog.secondaryKeywords || [],
        anchors: blog.anchors || [],
        scheduledFor: blog.scheduledFor ? new Date(blog.scheduledFor).toISOString() : undefined,
        contentBrief: blog.contentBrief ? {
            intent: blog.contentBrief.intent || "",
            primaryKeyword: blog.contentBrief.primaryKeyword || "",
            secondaryKeywords: blog.contentBrief.secondaryKeywords || [],
            competitorHeadings: blog.contentBrief.competitorHeadings || [],
            paaQuestions: blog.contentBrief.paaQuestions || [],
            entities: blog.contentBrief.entities || []
        } : undefined,
        qaReport: blog.qaReport ? {
            wordCount: blog.qaReport.wordCount || 0,
            headingCounts: blog.qaReport.headingCounts instanceof Map 
                ? Object.fromEntries(blog.qaReport.headingCounts) 
                : (blog.qaReport.headingCounts || {}),
            internalLinkCount: blog.qaReport.internalLinkCount || 0,
            primaryKeywordPresence: !!blog.qaReport.primaryKeywordPresence,
            metaTitleLength: blog.qaReport.metaTitleLength || 0,
            metaDescriptionLength: blog.qaReport.metaDescriptionLength || 0,
            status: blog.qaReport.status || "failed"
        } : undefined
    }));

    const defaultSheetUrl = process.env.GOOGLE_KEYWORDS_SHEET_URL || "";

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <DiagnosticsTable initialBlogs={blogs as unknown as Parameters<typeof DiagnosticsTable>[0]["initialBlogs"]} defaultSheetUrl={defaultSheetUrl} />
        </div>
    );
}
