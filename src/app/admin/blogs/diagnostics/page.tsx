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
        tags: blog.tags || []
    }));

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <DiagnosticsTable initialBlogs={blogs} />
        </div>
    );
}
