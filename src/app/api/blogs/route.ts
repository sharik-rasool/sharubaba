import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { scanContentHealth } from "@/lib/content-audit";

export async function GET() {
    try {
        await connectDB();
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
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(blogs);
    } catch {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const data = await request.json();
        
        // Content Health Audit Validation
        if (data && typeof data.content === "string") {
            const audit = scanContentHealth(data.content);
            if (audit.status === "critical") {
                return NextResponse.json(
                    { error: `Validation Blocked: ${audit.messages.join(" ")}` },
                    { status: 400 }
                );
            }
        }

        const blog = await Blog.create(data);
        
        revalidatePath("/blog");
        
        return NextResponse.json(blog, { status: 201 });
    } catch (error: unknown) {
        console.error("API Blog POST Error:", (error as Error)?.message || error);
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
