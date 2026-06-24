import { getPublishedBlogs } from "@/lib/blogs";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import type { Metadata } from "next";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata: Metadata = {
    title: "SEO & Link Building Blog",
    description:
        "Explore actionable SEO and link building strategies. Get expert tips on growing organic traffic, boosting domain authority, and scaling SaaS search rankings.",
    alternates: { canonical: "https://www.sharikrasool.com/blog" },
    openGraph: {
        title: "SEO & Link Building Blog",
        description:
            "Explore actionable SEO and link building strategies. Get expert tips on growing organic traffic, boosting domain authority, and scaling SaaS search rankings.",
        url: "https://www.sharikrasool.com/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SEO & Link Building Blog",
        description:
            "Explore actionable SEO and link building strategies. Get expert tips on growing organic traffic, boosting domain authority, and scaling SaaS search rankings.",
    },
};

export const revalidate = 3600;

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const POSTS_PER_PAGE = 9;

    const allPosts = await getPublishedBlogs();
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    
    const posts = allPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <section className="section bg-muted/30 min-h-screen">
            <div className="container-wide">
                <FadeIn>
                    <div className="text-center mb-16 pt-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                            The SEO <span className="text-primary italic">Lab</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            Practical, evidence-based SEO and link building strategies designed for modern SaaS companies and digital growth.
                        </p>
                    </div>
                </FadeIn>

                {allPosts.length === 0 ? (
                    <div className="text-center py-24 bg-card rounded-2xl border-2 border-dashed">
                        <p className="text-muted-foreground text-lg">No posts published yet — check back soon!</p>
                    </div>
                ) : (
                    <>
                        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post, index) => (
                                <StaggerItem key={post._id} className="h-full">
                                    <Link href={`/blog/${post.slug}`} className="block h-full group">
                                        <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border/50 group-hover:border-primary/20 overflow-hidden">
                                            {post.coverImage && (
                                                <div className="overflow-hidden aspect-video relative">
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        priority={index === 0}
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-6 flex flex-col flex-1">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-4">
                                                        {post.tags.length > 0 ? (
                                                            <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                                <Tag className="h-3 w-3" />
                                                                {post.tags[0]}
                                                            </div>
                                                        ) : <div />}
                                                        {post.readingTime > 0 && (
                                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                                                <Clock className="h-3 w-3" />
                                                                {post.readingTime} MIN READ
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                        {post.title}
                                                    </h2>
                                                    {post.excerpt && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                                            {post.excerpt}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                        READ POST <ArrowRight className="h-3.5 w-3.5" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>

                        {totalPages > 1 && (
                            <div className="mt-16">
                                <Pagination>
                                    <PaginationContent>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious href={`/blog?page=${currentPage - 1}`} />
                                            </PaginationItem>
                                        )}
                                        
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            // Simple pagination logic: show current, first, last, and neighbors
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            href={`/blog?page=${pageNum}`}
                                                            isActive={currentPage === pageNum}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            } else if (
                                                pageNum === currentPage - 2 ||
                                                pageNum === currentPage + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        })}

                                        {currentPage < totalPages && (
                                            <PaginationItem>
                                                <PaginationNext href={`/blog?page=${currentPage + 1}`} />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
