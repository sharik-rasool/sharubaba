import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    
    try {
        const cookieStore = await cookies();
        const viewedKey = `viewed_${id}`;
        
        // Simple cookie check to prevent self-refresh spam
        if (cookieStore.get(viewedKey)) {
            return NextResponse.json({ success: true, message: "Already counted" });
        }

        await connectDB();
        await Blog.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

        // Set cookie to expire in 24 hours
        cookieStore.set(viewedKey, "true", { 
            maxAge: 60 * 60 * 24,
            path: "/",
            httpOnly: true,
            sameSite: "lax"
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
    }
}
