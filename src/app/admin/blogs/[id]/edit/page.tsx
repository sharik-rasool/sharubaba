import { getBlogById } from "@/lib/blogs";
import { notFound } from "next/navigation";
import BlogForm from "../../BlogForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPage(props: Props) {
    const params = await props.params;
    const { id } = params;

    try {
        const blog = await getBlogById(id);

        if (!blog) {
            notFound();
        }

        return (
            <div className="space-y-6">
                <div>
                    <Link
                        href="/admin/blogs"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to posts
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                    <p className="text-sm text-muted-foreground mt-1">{blog.title}</p>
                </div>
                <BlogForm initialData={blog} />
            </div>
        );
    } catch (error: unknown) {
        console.error("Edit page error:", error);
        return (
            <div className="p-8 border-2 border-destructive bg-destructive/10 rounded-xl">
                <h1 className="text-xl font-bold text-destructive">Failed to load blog post</h1>
                <p className="mt-2 text-sm text-muted-foreground">This error occurred while trying to fetch the blog post for editing.</p>
                <div className="mt-4 p-4 bg-background rounded border font-mono text-xs overflow-auto">
                    {error instanceof Error ? error.message : String(error)}
                </div>
                <Button asChild className="mt-6" variant="outline">
                    <Link href="/admin/blogs">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }
}
