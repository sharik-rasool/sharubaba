import { getAllBlogs, getBlogLinkStats } from "@/lib/blogs";
import Link from "next/link";
import { FileText, Eye, FilePen, Plus, Link2, ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const revalidate = 0;

export default async function AdminDashboard() {
    const blogs = await getAllBlogs();
    const linkStats = await getBlogLinkStats();
    
    const now = new Date();
    const published = blogs.filter((b) => b.status === "published" || !!(b.scheduledFor && new Date(b.scheduledFor) <= now));
    const scheduled = blogs.filter((b) => b.status !== "published" && !!(b.scheduledFor && new Date(b.scheduledFor) > now));
    const drafts = blogs.filter((b) => b.status === "draft" && !b.scheduledFor);
    const recent = blogs.slice(0, 5);

    const totalInternal = linkStats.reduce((s, b) => s + b.internal, 0);
    const totalExternal = linkStats.reduce((s, b) => s + b.external, 0);
    const recentLinks = new Map(linkStats.map((b) => [b.id, b]));

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your blog content</p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{blogs.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                        <Eye className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{published.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
                        <FilePen className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">{drafts.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">{scheduled.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Internal Links</CardTitle>
                        <Link2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{totalInternal}</p>
                        <p className="text-xs text-muted-foreground mt-1">across all posts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">External Links</CardTitle>
                        <ExternalLink className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-600">{totalExternal}</p>
                        <p className="text-xs text-muted-foreground mt-1">across all posts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Posts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">Recent Posts</CardTitle>
                    <Link href="/admin/blogs" className="text-sm text-primary hover:underline">
                        View all
                    </Link>
                </CardHeader>
                <CardContent>
                    {recent.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
                            <p>No posts yet.</p>
                            <Link href="/admin/blogs/new">
                                <Button variant="outline" size="sm" className="mt-3">
                                    Create your first post
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recent.map((post) => {
                                const links = recentLinks.get(post._id) ?? { internal: 0, external: 0 };
                                return (
                                    <div key={post._id} className="flex items-center justify-between py-3 gap-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate">{post.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1" title="Internal links">
                                                <Link2 className="h-3 w-3 text-blue-500" />
                                                {links.internal}
                                            </span>
                                            <span className="flex items-center gap-1" title="External links">
                                                <ExternalLink className="h-3 w-3 text-orange-500" />
                                                {links.external}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {(() => {
                                                const nowObj = new Date();
                                                const isScheduled = post.status !== "published" && !!(post.scheduledFor && new Date(post.scheduledFor) > nowObj);
                                                const isPublished = post.status === "published" || !!(post.scheduledFor && new Date(post.scheduledFor) <= nowObj);
                                                return (
                                                    <Badge
                                                        variant={isScheduled ? "outline" : isPublished ? "default" : "secondary"}
                                                        className={`text-xs uppercase px-1.5 py-0.5 ${isScheduled ? "text-purple-600 border-purple-600 bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:bg-purple-950/20" : ""}`}
                                                    >
                                                        {isScheduled ? "scheduled" : isPublished ? "published" : "draft"}
                                                    </Badge>
                                                );
                                            })()}
                                            <Link
                                                href={`/admin/blogs/${post._id}/edit`}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
