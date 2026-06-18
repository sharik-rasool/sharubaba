import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User, Clock } from "lucide-react";
import type { Metadata } from "next";
import { parseHtmlForToc } from "@/lib/toc";
import TableOfContents from "@/components/blog/TableOfContents";
import ViewCounter from "@/components/blog/ViewCounter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    const isLive = post && (post.status === "published" || (post.scheduledFor && new Date(post.scheduledFor) <= new Date()));
    if (!post || !isLive) {
        return { title: "Post Not Found" };
    }

    const seoTitle = post.seoTitle || post.title;
    const seoDescription = post.seoDescription || post.excerpt;
    const baseUrl = "https://www.sharikrasool.com";

    return {
        title: seoTitle,
        description: seoDescription,
        alternates: { canonical: post.canonicalUrl || `${baseUrl}/blog/${post.slug}` },
        robots: post.robotsMeta || "index, follow",
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: `${baseUrl}/blog/${post.slug}`,
            type: "article",
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: ["Sharik Rasool"],
            tags: post.tags,
            images: post.ogImage || post.coverImage
                ? [{ url: post.ogImage || post.coverImage, width: 1200, height: 630, alt: post.title }]
                : [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: seoDescription,
        },
    };
}

export async function generateStaticParams() {
    const posts = await getPublishedBlogs();
    return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    const isLive = post && (post.status === "published" || (post.scheduledFor && new Date(post.scheduledFor) <= new Date()));
    if (!post || !isLive) notFound();

    const { toc, html: parsedHtml, headingCount } = parseHtmlForToc(post.content);
    const showToc = headingCount >= 3;

    const baseUrl = "https://www.sharikrasool.com";
    const postUrl = `${baseUrl}/blog/${post.slug}`;

    const schemas: Record<string, unknown>[] = [];

    // 1. Article Schema
    schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImage ? [post.coverImage] : [`${baseUrl}/og-image.jpg`],
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: {
            "@type": "Person",
            name: "Sharik Rasool",
            url: `${baseUrl}/about`,
        },
        publisher: {
            "@type": "Organization",
            name: "Sharik Rasool",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
        },
    });

    // 2. FAQPage Schema
    if (post.faqs && post.faqs.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            })),
        });
    }

    // 3. ItemList Schema for TOC
    if (showToc && toc.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: toc.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.text,
                url: `${postUrl}#${item.id}`,
            })),
        });
    }

    // 4. Breadcrumb Schema
    schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${baseUrl}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: postUrl,
            },
        ],
    });

    return (
        <article className="section">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />
            
            <ViewCounter id={post._id} />

            <div className="container-narrow">
                <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-foreground">Blog</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
                </nav>

                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Link>

                {post.coverImage && (
                    <div className="mb-8 overflow-hidden rounded-xl border">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={1200}
                            height={630}
                            priority
                            className="w-full h-auto max-h-[500px] object-cover"
                        />
                    </div>
                )}

                <header className="mb-10">
                    {post.tags.length > 0 && (
                        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                            <Tag className="h-4 w-4" />
                            {post.tags[0]}
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-6">
                        <span className="flex items-center gap-2 text-foreground font-medium">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                <User className="h-3.5 w-3.5" />
                            </div>
                            Sharik Rasool
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit"
                            })}
                        </span>
                        {post.readingTime > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {post.readingTime} min read
                            </span>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
                    <div className="min-w-0">
                        {/* Mobile TOC */}
                        {showToc && (
                            <div className="block lg:hidden mb-12">
                                <TableOfContents toc={toc} />
                            </div>
                        )}

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-custom prose-headings:scroll-mt-20"
                            dangerouslySetInnerHTML={{ __html: parsedHtml }}
                        />

                        {/* FAQs Section */}
                        {post.faqs && post.faqs.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-border">
                                <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {post.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-border">
                                            <AccordionTrigger className="text-left font-semibold text-lg py-4">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / TOC */}
                    {showToc && (
                        <aside className="hidden lg:block sticky top-24">
                            <TableOfContents toc={toc} />
                        </aside>
                    )}
                </div>

                {post.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-border">
                        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 bg-muted text-muted-foreground rounded-md text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                                >
                                    #{tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
