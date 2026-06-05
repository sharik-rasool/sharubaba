"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    Activity, CheckCircle2, AlertTriangle, AlertCircle, 
    ArrowLeft, ExternalLink, PenSquare, ChevronDown, ChevronUp, 
    Wrench, Sparkles, RefreshCw, Loader2, Search, Check 
} from "lucide-react";
import Link from "next/link";
import { scanContentHealth, type ContentHealth } from "@/lib/content-audit";
import { cn } from "@/lib/utils";

interface SimpleBlog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    status: "draft" | "published";
    updatedAt: string;
    createdAt: string;
    seoDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    coverImage?: string;
    tags?: string[];
}

interface DiagnosticsTableProps {
    initialBlogs: SimpleBlog[];
}

export default function DiagnosticsTable({ initialBlogs }: DiagnosticsTableProps) {
    const [blogs, setBlogs] = useState<SimpleBlog[]>(initialBlogs);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "safe" | "warning" | "critical">("all");
    const [sortField, setSortField] = useState<"title" | "score" | "size">("score");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    
    // Action states
    const [repairingIds, setRepairingIds] = useState<Record<string, boolean>>({});
    const [repairingAll, setRepairingAll] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    // Trigger full diagnostic re-scan
    const [scanTrigger, setScanTrigger] = useState(0);

    // Run audit on each blog post in state
    const auditedBlogs = blogs.map(blog => {
        const audit = scanContentHealth(
            blog.content,
            {
                title: blog.title,
                slug: blog.slug,
                seoDescription: blog.seoDescription,
                canonicalUrl: blog.canonicalUrl,
                ogImage: blog.ogImage,
                coverImage: blog.coverImage,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
                tags: blog.tags
            },
            blogs.map(b => ({
                _id: b._id,
                title: b.title,
                slug: b.slug,
                content: b.content,
                createdAt: b.createdAt,
                tags: b.tags
            })),
            blog._id
        );
        return {
            ...blog,
            audit
        };
    });

    // Handle row expand/collapse
    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Repair a single blog post
    const handleRepairSingle = async (id: string, title: string) => {
        setRepairingIds(prev => ({ ...prev, [id]: true }));
        setActionMessage(null);
        try {
            const res = await fetch(`/api/blogs/${id}/repair`, {
                method: "POST",
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                // Update specific blog content in the state
                setBlogs(prev => prev.map(b => b._id === id ? { ...b, content: data.blog.content } : b));
                setActionMessage({
                    type: "success",
                    text: `Successfully repaired: "${title}"`
                });
            } else {
                throw new Error(data.error || "Repair failed");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setActionMessage({
                type: "error",
                text: `Error repairing "${title}": ${errorMessage}`
            });
        } finally {
            setRepairingIds(prev => ({ ...prev, [id]: false }));
        }
    };

    // Repair all blog posts in bulk
    const handleRepairAll = async () => {
        setRepairingAll(true);
        setActionMessage(null);
        try {
            const res = await fetch("/api/blogs/repair-all", {
                method: "POST"
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Refresh data from api/blogs
                const fetchRes = await fetch("/api/blogs");
                if (fetchRes.ok) {
                    const freshBlogs = await fetchRes.json();
                    setBlogs(freshBlogs);
                }
                setActionMessage({
                    type: "success",
                    text: data.message || "Global repair completed successfully."
                });
            } else {
                throw new Error(data.error || "Global repair failed");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setActionMessage({
                type: "error",
                text: `Global repair failed: ${errorMessage}`
            });
        } finally {
            setRepairingAll(false);
        }
    };

    // Aggregates
    const totalCount = auditedBlogs.length;
    const totalSize = auditedBlogs.reduce((acc, b) => acc + b.audit.contentSize, 0);
    const avgSize = totalCount > 0 ? totalSize / totalCount : 0;
    const base64Count = auditedBlogs.reduce((acc, b) => acc + b.audit.base64Count, 0);
    
    const criticalBlogs = auditedBlogs.filter(b => b.audit.status === "critical");
    const warningBlogs = auditedBlogs.filter(b => b.audit.status === "warning");
    const safeBlogs = auditedBlogs.filter(b => b.audit.status === "safe");

    // Filter & Sort
    const filteredBlogs = auditedBlogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             blog.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || blog.audit.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        let compare = 0;
        if (sortField === "title") {
            compare = a.title.localeCompare(b.title);
        } else if (sortField === "score") {
            compare = a.audit.seoHealthScore - b.audit.seoHealthScore;
        } else if (sortField === "size") {
            compare = a.audit.contentSize - b.audit.contentSize;
        }
        return sortOrder === "asc" ? compare : -compare;
    });

    const toggleSort = (field: "title" | "score" | "size") => {
        if (sortField === field) {
            setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Blog Health & SEO Diagnostics
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Audit, sanitize and auto-repair crawl footprint & structure issues across all posts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={repairingAll}
                        onClick={async () => {
                            setActionMessage(null);
                            const res = await fetch("/api/blogs");
                            if (res.ok) {
                                const freshBlogs = await res.json();
                                setBlogs(freshBlogs);
                                setActionMessage({ type: "success", text: "Diagnostics data refreshed." });
                            }
                        }}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Rescan
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={handleRepairAll} 
                        disabled={repairingAll || totalCount === 0} 
                        className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-md"
                    >
                        {repairingAll ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                        One-Click Global Repair
                    </Button>
                    <Link href="/admin/blogs">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Posts
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Notification Alert banner */}
            {actionMessage && (
                <div className={cn(
                    "p-4 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300",
                    actionMessage.type === "success" 
                        ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-900/50" 
                        : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/50"
                )}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {actionMessage.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                        <span>{actionMessage.text}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setActionMessage(null)} className="h-7 w-7 p-0 ml-4">
                        <span className="text-xs">×</span>
                    </Button>
                </div>
            )}

            {/* Diagnostics Aggregate Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Health Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        {criticalBlogs.length > 0 ? (
                            <>
                                <AlertCircle className="h-5 w-5 text-destructive animate-pulse" />
                                <span className="text-base font-bold text-destructive">Action Required</span>
                            </>
                        ) : warningBlogs.length > 0 ? (
                            <>
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">Warnings</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                                <span className="text-base font-bold text-green-600 dark:text-green-500">Perfect SEO</span>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Footprint</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{(totalSize / 1024).toFixed(1)} KB</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Average size: {(avgSize / 1024).toFixed(1)} KB</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base64 Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn("text-2xl font-bold", base64Count > 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                            {base64Count}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {base64Count > 0 ? "Blocks crawl on prod" : "All clean!"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critical Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={cn("text-2xl font-bold", criticalBlogs.length > 0 ? "text-destructive" : "text-muted-foreground")}>
                            {criticalBlogs.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Must be resolved</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Warning Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {warningBlogs.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Under-optimized structures</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter controls panel */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-lg border border-border/80">
                <div className="flex flex-1 items-center gap-2 w-full max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                        placeholder="Search posts by title or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background h-9"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <span>Filter SEO rating:</span>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as "all" | "safe" | "warning" | "critical")}
                        className="flex h-9 w-full sm:w-[130px] rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="all">All Ratings</option>
                        <option value="safe">Perfect (Safe)</option>
                        <option value="warning">Warnings</option>
                        <option value="critical">Critical</option>
                    </select>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 pl-2">
                        <span>Sort:</span>
                    </div>
                    <select
                        value={sortField}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortField(e.target.value as "title" | "score" | "size")}
                        className="flex h-9 w-full sm:w-[130px] rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="score">Health Score</option>
                        <option value="size">Content Size</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </div>

            {/* Audit Details */}
            <Card className="shadow-sm border-border">
                <CardHeader className="border-b border-border/40 pb-4">
                    <CardTitle className="text-lg">Detailed Audit Logs</CardTitle>
                    <CardDescription>Comprehensive report of headings structure, images metadata, link health and SEO compliance</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/20">
                                    <th className="w-8 px-4 py-3"></th>
                                    <th 
                                        onClick={() => toggleSort("title")}
                                        className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground"
                                    >
                                        Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                                    <th 
                                        onClick={() => toggleSort("size")}
                                        className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground"
                                    >
                                        Size {sortField === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th 
                                        onClick={() => toggleSort("score")}
                                        className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground"
                                    >
                                        Score {sortField === "score" && (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Rating</th>
                                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {sortedBlogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                            No blog posts found matching the filters.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedBlogs.map((blog) => {
                                        const audit = blog.audit;
                                        const isExpanded = !!expandedRows[blog._id];
                                        const score = audit.seoHealthScore ?? 100;
                                        const isRepairing = !!repairingIds[blog._id];

                                        const slugLower = (blog.slug || "").toLowerCase();
                                        const tagsLower = (blog.tags || []).map(t => t.toLowerCase());
                                        const isToolOrLanding = slugLower.includes("-tool") || 
                                                                slugLower.includes("-calculator") || 
                                                                slugLower.includes("landing") || 
                                                                tagsLower.includes("tool") || 
                                                                tagsLower.includes("landing");
                                        const isNewPost = audit.ageInDays <= 30;

                                        return (
                                            <>
                                                <tr key={blog._id} className={cn("hover:bg-muted/10 transition-colors", isExpanded && "bg-muted/5")}>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleRow(blog._id)}
                                                            className="h-6 w-6 p-0 shrink-0"
                                                        >
                                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        </Button>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <p className="font-semibold text-foreground leading-snug line-clamp-1">{blog.title}</p>
                                                        <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">/blog/{blog.slug}</p>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <Badge variant={blog.status === "published" ? "default" : "secondary"} className="text-[9px] uppercase tracking-wide">
                                                            {blog.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3.5 font-medium">
                                                        {(audit.contentSize / 1024).toFixed(1)} KB
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <span className={cn(
                                                            "font-bold text-xs px-2 py-0.5 rounded",
                                                            score >= 90 ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" :
                                                            score >= 70 ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400" :
                                                            "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                                        )}>
                                                            {score}/100
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <Badge
                                                            className="text-[9px] uppercase font-bold tracking-wider"
                                                            variant={audit.status === "safe" ? "default" : (audit.status === "warning" ? "secondary" : "destructive")}
                                                        >
                                                            {audit.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isRepairing || repairingAll}
                                                                onClick={() => handleRepairSingle(blog._id, blog.title)}
                                                                className="h-8 gap-1 text-xs border-dashed hover:border-solid shrink-0"
                                                            >
                                                                {isRepairing ? (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                ) : (
                                                                    <Wrench className="h-3.5 w-3.5" />
                                                                )}
                                                                Repair
                                                            </Button>
                                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0" title="Edit Content">
                                                                <Link href={`/admin/blogs/${blog._id}/edit`}>
                                                                    <PenSquare className="h-4 w-4 text-primary" />
                                                                </Link>
                                                            </Button>
                                                            {blog.status === "published" && (
                                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0" title="View Article">
                                                                    <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded warning log list */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                                                        <td colSpan={7} className="px-6 py-5 border-t border-border/40">
                                                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-xs leading-relaxed">
                                                                
                                                                {/* 1. Content Metadata & Schema */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <Activity className="h-3.5 w-3.5 text-indigo-500" />
                                                                        Metadata & Rendered Schema
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Canonical URL:</span>
                                                                            <span className={cn("font-mono text-[10px]", audit.missingCanonical ? "text-destructive font-bold" : "text-green-600 dark:text-green-400")}>
                                                                                {audit.missingCanonical ? "Invalid / Missing" : "Valid"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Meta Description:</span>
                                                                            <span className={cn("font-medium", audit.missingMetaDesc ? "text-destructive font-bold" : "text-green-600 dark:text-green-400")}>
                                                                                {audit.missingMetaDesc ? "Missing" : "Valid"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">OG / Social Image:</span>
                                                                            <span className={cn("font-medium", audit.missingOgImage ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400")}>
                                                                                {audit.missingOgImage ? "Missing" : "Valid"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="py-1">
                                                                            <span className="text-muted-foreground block mb-1">Rendered Article Schema:</span>
                                                                            {audit.missingSchemaProps.length > 0 ? (
                                                                                <div className="text-[10px] text-destructive bg-destructive/5 border border-destructive/10 rounded p-1.5 mt-1">
                                                                                    <strong>Missing Fields:</strong> {audit.missingSchemaProps.join(", ")}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                                                                    <CheckCircle2 className="h-3.5 w-3.5" /> All Structured Data Properties Present
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* 2. Content Freshness & Aging */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <RefreshCw className="h-3.5 w-3.5 text-emerald-500" />
                                                                        Content Freshness
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Last Updated:</span>
                                                                            <span className="font-medium">
                                                                                {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "Never"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Published Date:</span>
                                                                            <span className="font-medium">
                                                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Never"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1">
                                                                            <span className="text-muted-foreground">Content Age:</span>
                                                                            <span className={cn("font-medium", audit.ageInDays > 180 ? "text-yellow-600 dark:text-yellow-400 font-bold" : "text-green-600 dark:text-green-400")}>
                                                                                {audit.ageInDays} Days
                                                                            </span>
                                                                        </div>
                                                                        {audit.ageInDays > 180 && (
                                                                            <div className="text-[10px] text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded p-2 mt-2">
                                                                                <strong>Refresh Recommended:</strong> Post is over 6 months old. Consider updating stats, quotes, or keywords to maintain organic rankings.
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* 3. Link Profile & Orphans */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                                                                        Internal Link Profile & Orphans
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Outgoing Internal Links:</span>
                                                                            <span className="font-medium">{audit.internalLinksCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Incoming Links:</span>
                                                                            <span className="font-medium">{audit.incomingLinksCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1">
                                                                            <span className="text-muted-foreground">Orphan Article Status:</span>
                                                                            {audit.isOrphan ? (
                                                                                <span className={cn("font-bold px-1.5 py-0.5 rounded text-[10px]", isToolOrLanding || isNewPost ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400")}>
                                                                                    {isToolOrLanding ? "Excluded (Tool/Landing)" : isNewPost ? "Excluded (New <30d)" : "Orphaned"}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-green-600 dark:text-green-400 font-medium">Linked (No issue)</span>
                                                                            )}
                                                                        </div>
                                                                        {audit.internalLinkSuggestions.length > 0 && (
                                                                            <div className="text-[10px] bg-slate-50 dark:bg-slate-900/40 border border-border rounded p-2 mt-2">
                                                                                <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Informational Link Opportunities:</strong>
                                                                                <ul className="list-disc pl-3.5 space-y-1 mt-1">
                                                                                    {audit.internalLinkSuggestions.map((s, idx) => (
                                                                                        <li key={idx}>
                                                                                            Add link to <code className="font-mono text-slate-700 dark:text-slate-300">/blog/{s.slug}</code> (matched: <span className="underline italic">"{s.matchedPhrase}"</span>)
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* 4. Headings & Obsolete Markup */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <Wrench className="h-3.5 w-3.5 text-violet-500" />
                                                                        Headings & Obsolete HTML
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Total Headings (H2-H4):</span>
                                                                            <span className="font-medium">{audit.headingsCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Malformed Headings:</span>
                                                                            <span className={cn("font-medium", audit.malformedHeadingsCount > 0 && "text-destructive font-bold")}>{audit.malformedHeadingsCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Obsolete Tags found:</span>
                                                                            <span className={cn("font-medium", audit.deprecatedTagsCount > 0 && "text-destructive font-bold")}>
                                                                                {audit.deprecatedTagsCount}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1">
                                                                            <span className="text-muted-foreground">Obsolete Attributes:</span>
                                                                            <span className={cn("font-medium", audit.deprecatedAttrsCount > 0 && "text-destructive font-bold")}>
                                                                                {audit.deprecatedAttrsCount}
                                                                            </span>
                                                                        </div>
                                                                        {(audit.deprecatedTagsCount > 0 || audit.deprecatedAttrsCount > 0) && (
                                                                            <div className="text-[10px] text-destructive bg-destructive/5 border border-destructive/10 rounded p-1.5 mt-1.5">
                                                                                <strong>Obsolete markup:</strong> {audit.deprecatedDetails.join(", ")}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* 5. Expanded Media & Alt Text */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                                                        Expanded Media & Alt Text
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Total Images:</span>
                                                                            <span className="font-medium">{audit.imageCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Short Alt Texts (&lt;5 chars):</span>
                                                                            <span className={cn("font-medium", audit.shortAltsCount > 0 && "text-yellow-600 dark:text-yellow-400 font-bold")}>{audit.shortAltsCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Generic Alt Texts:</span>
                                                                            <span className={cn("font-medium", audit.genericAltsCount > 0 && "text-yellow-600 dark:text-yellow-400 font-bold")}>{audit.genericAltsCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Oversized Images (&gt;1600px):</span>
                                                                            <span className={cn("font-medium", audit.oversizedImagesCount > 0 && "text-yellow-600 dark:text-yellow-400 font-bold")}>{audit.oversizedImagesCount}</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1">
                                                                            <span className="text-muted-foreground">Heavy Embeds (iframes/widgets):</span>
                                                                            <span className={cn("font-medium", audit.heavyEmbedsCount > 0 && "text-yellow-600 dark:text-yellow-400 font-bold")}>{audit.heavyEmbedsCount}</span>
                                                                        </div>
                                                                        {audit.duplicateAlts.length > 0 && (
                                                                            <div className="text-[10px] text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded p-1.5 mt-1.5">
                                                                                <strong>Duplicate Alts:</strong> {Array.from(new Set(audit.duplicateAlts)).join(", ")}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* 6. Crawl & Performance Stats */}
                                                                <div className="bg-background p-4 rounded-lg border border-border/60 shadow-sm space-y-3">
                                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5 border-b border-border/40 pb-1.5">
                                                                        <Search className="h-3.5 w-3.5 text-sky-500" />
                                                                        Crawl & Performance Stats
                                                                    </h4>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">HTML Size (Raw):</span>
                                                                            <span className="font-medium">{(audit.contentSize / 1024).toFixed(1)} KB</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1 border-b border-border/20">
                                                                            <span className="text-muted-foreground">Rendered Page Size (Est):</span>
                                                                            <span className="font-medium">{(audit.renderedContentSize / 1024).toFixed(1)} KB</span>
                                                                        </div>
                                                                        <div className="flex justify-between py-1">
                                                                            <span className="text-muted-foreground">Image Weight (Est):</span>
                                                                            <span className="font-medium">{(audit.imagePayloadEstimate / 1024).toFixed(1)} KB</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            {audit.messages.length > 0 && (
                                                                <div className="mt-4 pt-3 border-t border-border/40">
                                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Detailed Action Items</div>
                                                                    <div className="space-y-1.5">
                                                                        {audit.messages.map((msg, idx) => (
                                                                            <div key={idx} className="flex gap-2 items-start text-[11px] leading-tight">
                                                                                {msg.includes("critical") || msg.includes("Base64") || msg.includes("missing") || msg.includes("Must be resolved") ? (
                                                                                    <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                                                                                ) : (
                                                                                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                                                                                )}
                                                                                <span className={msg.includes("critical") || msg.includes("Base64") || msg.includes("missing") ? "text-destructive font-medium" : "text-muted-foreground"}>
                                                                                    {msg}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
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
