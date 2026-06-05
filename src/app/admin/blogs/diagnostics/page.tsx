import { getAllBlogs } from "@/lib/blogs";
import { scanContentHealth } from "@/lib/content-audit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle, AlertTriangle, AlertCircle, HelpCircle, ArrowLeft, ExternalLink, PenSquare } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable caching for the diagnostics panel

export default async function DiagnosticsPage() {
    const blogs = await getAllBlogs();
    
    // Scan all blogs
    const auditedBlogs = blogs.map(blog => {
        const audit = scanContentHealth(blog.content);
        return {
            ...blog,
            audit
        };
    });

    // Aggregates
    const totalCount = auditedBlogs.length;
    const totalSize = auditedBlogs.reduce((acc, b) => acc + b.audit.contentSize, 0);
    const avgSize = totalCount > 0 ? totalSize / totalCount : 0;
    const base64Count = auditedBlogs.reduce((acc, b) => acc + b.audit.base64Count, 0);
    
    const criticalBlogs = auditedBlogs.filter(b => b.audit.status === "critical");
    const warningBlogs = auditedBlogs.filter(b => b.audit.status === "warning");
    const safeBlogs = auditedBlogs.filter(b => b.audit.status === "safe");

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Blog Health & SEO Diagnostics
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Monitor content sizes and block crawl footprint issues (Googlebot 2 MB limit)
                    </p>
                </div>
                <Link href="/admin/blogs">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Posts
                    </Button>
                </Link>
            </div>

            {/* Diagnostics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Health Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        {criticalBlogs.length > 0 ? (
                            <>
                                <AlertCircle className="h-6 w-6 text-destructive" />
                                <span className="text-lg font-bold text-destructive">Action Required</span>
                            </>
                        ) : warningBlogs.length > 0 ? (
                            <>
                                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">Warnings</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
                                <span className="text-lg font-bold text-green-600 dark:text-green-500">Perfect</span>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Content Footprint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{(totalSize / 1024).toFixed(1)} KB</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Average: {(avgSize / 1024).toFixed(1)} KB</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Embedded Base64 Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${base64Count > 0 ? "text-destructive" : "text-green-600 dark:text-green-500"}`}>
                            {base64Count}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {base64Count > 0 ? "Blockers on production" : "All clean!"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critical Posts (&gt;5MB / Base64)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${criticalBlogs.length > 0 ? "text-destructive" : ""}`}>
                            {criticalBlogs.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Must fix to allow publish</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Warning Posts (&gt;500KB)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {warningBlogs.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Optimize for SEO speed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Detailed Audit Logs</CardTitle>
                    <CardDescription>Comprehensive report of crawl safety constraints for each blog post</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Title</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-left font-semibold text-semibold text-muted-foreground">Content Size</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Images (Base64)</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Est. Crawl Size</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Audit Rating</th>
                                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {auditedBlogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                            No posts found.
                                        </td>
                                    </tr>
                                ) : (
                                    auditedBlogs.map((blog) => {
                                        const audit = blog.audit;
                                        // Est Rendered Size is size + typical wrapping elements (approx 20KB)
                                        // Duplicated base64 in Next.js payload means base64 size * 2 + baseline
                                        const rawSize = audit.contentSize;
                                        const base64Bytes = audit.base64Count > 0 ? rawSize : 0; // approximate
                                        const estCrawlSize = rawSize + base64Bytes + (20 * 1024);
                                        const crawlSizeStr = (estCrawlSize / 1024).toFixed(1) + " KB";

                                        return (
                                            <tr key={blog._id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <p className="font-semibold text-foreground leading-snug line-clamp-1">{blog.title}</p>
                                                    <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">/blog/{blog.slug}</p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge variant={blog.status === "published" ? "default" : "secondary"} className="text-[10px] uppercase">
                                                        {blog.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3.5 font-medium">
                                                    {(rawSize / 1024).toFixed(1)} KB
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-col text-xs">
                                                        <span>{audit.imageCount} total</span>
                                                        {audit.base64Count > 0 && (
                                                            <span className="text-destructive font-bold">({audit.base64Count} Base64!)</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className={estCrawlSize > 2 * 1024 * 1024 ? "text-destructive font-bold" : "text-foreground font-medium"}>
                                                        {crawlSizeStr}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <Badge
                                                        className="text-[10px] uppercase font-bold"
                                                        variant={audit.status === "safe" ? "default" : (audit.status === "warning" ? "secondary" : "destructive")}
                                                    >
                                                        {audit.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="Edit">
                                                            <Link href={`/admin/blogs/${blog._id}/edit`}>
                                                                <PenSquare className="h-4 w-4 text-primary" />
                                                            </Link>
                                                        </Button>
                                                        {blog.status === "published" && (
                                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="View Live">
                                                                <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
