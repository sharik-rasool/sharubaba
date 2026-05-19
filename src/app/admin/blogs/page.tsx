import { getAllBlogs, getBlogLinkStats } from "@/lib/blogs";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogList from "./BlogList";

export default async function AdminBlogsPage() {
    const blogs = await getAllBlogs();
    const linkStats = await getBlogLinkStats();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <p className="text-sm text-muted-foreground mt-1">{blogs.length} post{blogs.length !== 1 ? "s" : ""} total</p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            <BlogList blogs={blogs} linkStats={linkStats} />
        </div>
    );
}

