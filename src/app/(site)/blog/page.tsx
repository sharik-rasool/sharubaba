import { getPublishedBlogs } from "@/lib/blogs";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import type { Metadata } from "next";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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

                        {/* Educational / Explanatory Section to boost Text-to-HTML ratio and build SEO topical authority */}
                        <div className="mt-20 md:mt-28 border-t border-border/50 pt-12 md:pt-16 max-w-4xl mx-auto">
                            <div className="prose dark:prose-invert max-w-none mb-12 space-y-6">
                                <h2 className="text-2xl md:text-3xl font-bold">What is The SEO Lab Blog?</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    The SEO Lab is an educational resource dedicated to demystifying modern search engine optimization, 
                                    organic traffic growth, and editorial-focused link building. We focus on evidence-based, practical strategies 
                                    that help SaaS brands, developers, and digital publishers scale their rankings on Google safely and sustainably.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-foreground">SaaS Search Strategies</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Learn how to map out search intent, write high-intent product comparison guides, and build landing page models that convert organic traffic.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-foreground">Outreach & Link Building</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Discover how to craft high-conversion outreach emails, secure guest contributions on high-DA sites, and earn permanent editorial backlink placements.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-foreground">Technical SEO & Audits</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Step-by-step guides on technical indexing, optimizing Core Web Vitals, structuring JSON-LD schema markup, and fixing crawl errors.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem 
                                        value="blog-faq-1" 
                                        className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                                    >
                                        <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                            How frequently do you publish new SEO and growth guides?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1 text-sm">
                                            We publish fresh, data-backed guides twice a week, covering the latest shifts in Google algorithms, technical web optimizations, and content marketing systems.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem 
                                        value="blog-faq-2" 
                                        className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                                    >
                                        <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                            Can I pitch a guest post for publication on The SEO Lab?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1 text-sm">
                                            I accept high-quality guest contributions from fellow digital marketers, SaaS founders, and developers. Pitches must contain unique case studies, data, or technical walkthroughs that haven't been published elsewhere.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem 
                                        value="blog-faq-3" 
                                        className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                                    >
                                        <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                            Who is the primary audience for these SEO tutorials?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1 text-sm">
                                            These articles are written primarily for SaaS founders, product marketing managers, in-house content creators, freelance developers, and agency owners seeking structured roadmaps to grow organic traffic.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
