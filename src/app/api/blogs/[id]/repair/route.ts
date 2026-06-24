import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { sanitizeContent, convertImageHeadings, generateHeadingIds } from "@/lib/blog-cleaner";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    try {
        await connectDB();
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        // Apply repairs in order:
        // 1. Google Docs / Word / ChatGPT Sanitization
        let cleanedContent = sanitizeContent(blog.content || "");
        // 2. Convert image-only headings to figure tags
        cleanedContent = convertImageHeadings(cleanedContent);
        // 3. Generate unique heading IDs
        cleanedContent = generateHeadingIds(cleanedContent);

        // Update blog post content
        blog.content = cleanedContent;
        await blog.save();

        // Revalidate NextJS routes
        revalidatePath("/blog");
        revalidatePath(`/blog/${blog.slug}`);
        
        revalidateTag("blogs");
        revalidateTag(`blog-slug-${blog.slug}`);

        return NextResponse.json({ success: true, blog });
    } catch (error) {
        console.error("Error repairing blog post:", error);
        return NextResponse.json({ error: "Failed to repair blog post" }, { status: 500 });
    }
}
