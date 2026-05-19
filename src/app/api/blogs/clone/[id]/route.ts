import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

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
        const originalBlog = await Blog.findById(id).lean();
        if (!originalBlog) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // Remove unique/system fields and reset for cloning
        const blogObj = JSON.parse(JSON.stringify(originalBlog));
        const { _id, createdAt, updatedAt, __v, ...cloneData } = blogObj;
        
        cloneData.title = `${cloneData.title} (Copy)`;
        cloneData.slug = `${cloneData.slug}-copy-${Date.now()}`;
        cloneData.status = "draft";
        cloneData.scheduledFor = null;
        cloneData.viewCount = 0;

        const clonedBlog = await Blog.create(cloneData);
        return NextResponse.json(clonedBlog, { status: 201 });
    } catch (error: unknown) {
        console.error("CLONE ERROR:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to clone blog" },
            { status: 500 }
        );
    }
}
