"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Link2, ExternalLink, PenSquare, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import BlogDeleteButton from "./BlogDeleteButton";
import BlogCloneButton from "./BlogCloneButton";
import type { BlogDoc } from "@/lib/blogs";

interface BlogListProps {
    blogs: BlogDoc[];
    linkStats: { id: string; internal: number; external: number }[];
}

export default function BlogList({ blogs, linkStats }: BlogListProps) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const linkMap = new Map(linkStats.map((s) => [s.id, s]));

    const filteredBlogs = blogs
        .filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                                post.slug.toLowerCase().includes(search.toLowerCase());
            
            const isScheduled = !!(post.scheduledFor && new Date(post.scheduledFor) > new Date());
            let matchesStatus = true;
            if (statusFilter === "published") {
                matchesStatus = (post.status === "published" || !!(post.scheduledFor && new Date(post.scheduledFor) <= new Date())) && !isScheduled;
            } else if (statusFilter === "scheduled") {
                matchesStatus = isScheduled;
            } else if (statusFilter === "draft") {
                matchesStatus = post.status === "draft" && !isScheduled;
            }
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px] h-10">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published (Live)</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[130px] h-10">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Slug</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Links</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                        No posts found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((post) => {
                                    const stats = linkMap.get(post._id) ?? { internal: 0, external: 0 };
                                    return (
                                        <tr key={post._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium truncate max-w-[200px] lg:max-w-[300px]">{post.title}</p>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-muted-foreground font-mono text-[10px] truncate max-w-[150px] block">{post.slug}</span>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5" title="Internal links">
                                                        <Link2 className="h-3 w-3 text-blue-500" />
                                                        {stats.internal}
                                                    </span>
                                                    <span className="flex items-center gap-0.5" title="External links">
                                                        <ExternalLink className="h-3 w-3 text-orange-500" />
                                                        {stats.external}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {(() => {
                                                    const isScheduled = post.scheduledFor && new Date(post.scheduledFor) > new Date();
                                                    const isPublished = post.status === "published" || (post.scheduledFor && new Date(post.scheduledFor) <= new Date());
                                                    return (
                                                        <Badge
                                                            variant={isScheduled ? "outline" : isPublished ? "default" : "secondary"}
                                                            className={`text-[10px] uppercase px-1.5 py-0 ${isScheduled ? "text-purple-600 border-purple-600 bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:bg-purple-950/20" : ""}`}
                                                        >
                                                            {isScheduled ? "scheduled" : isPublished ? "published" : "draft"}
                                                        </Badge>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit"
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {(post.status === "published" || (post.scheduledFor && new Date(post.scheduledFor) <= new Date())) && (
                                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="View Live">
                                                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <BlogCloneButton id={post._id} />
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8" title="Edit Post">
                                                        <Link href={`/admin/blogs/${post._id}/edit`}>
                                                            <PenSquare className="h-4 w-4 text-primary" />
                                                        </Link>
                                                    </Button>
                                                    <BlogDeleteButton id={post._id} title={post.title} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
