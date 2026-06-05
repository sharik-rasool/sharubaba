import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sanitizeContent, convertImageHeadings, generateHeadingIds } from "@/lib/blog-cleaner";

export async function POST(_request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const blogs = await Blog.find({});
        
        let repairedCount = 0;
        
        for (const blog of blogs) {
            let cleanedContent = sanitizeContent(blog.content || "");
            cleanedContent = convertImageHeadings(cleanedContent);
            cleanedContent = generateHeadingIds(cleanedContent);
            
            // Only update if it actually changed
            if (cleanedContent !== blog.content) {
                blog.content = cleanedContent;
                await blog.save();
                repairedCount++;
                
                // Revalidate individual post page cache
                revalidatePath(`/blog/${blog.slug}`);
            }
        }

        if (repairedCount > 0) {
            revalidatePath("/blog");
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully checked ${blogs.length} posts and repaired ${repairedCount} of them.`,
            totalChecked: blogs.length,
            repairedCount
        });
    } catch (error) {
        console.error("Error repairing all blog posts:", error);
        return NextResponse.json({ error: "Failed to repair all blog posts" }, { status: 500 });
    }
}
