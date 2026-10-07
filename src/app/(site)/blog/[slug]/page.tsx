import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, User, Clock, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { parseHtmlForToc } from "@/lib/toc";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogSidebarCta from "@/components/blog/BlogSidebarCta";
import ViewCounter from "@/components/blog/ViewCounter";
import { AdminEditBanner } from "@/components/blog/AdminEditBanner";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const revalidate = 3600;
export const dynamicParams = true;

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

    let seoTitle = post.seoTitle || post.title;
    // Differentiate title tag from H1 heading if title is relatively short and no custom SEO title is defined
    if (!post.seoTitle && seoTitle.length <= 45) {
        seoTitle = `${seoTitle} | Insights`;
    }

    let rawDescription = post.seoDescription || post.excerpt || "";
    rawDescription = rawDescription.replace(/\s+/g, " ").trim();
    let seoDescription = rawDescription;
    if (seoDescription.length > 155) {
        seoDescription = seoDescription.slice(0, 152).trim().replace(/[,\.\s]+$/, "") + "...";
    }

    const baseUrl = "https://www.sharikrasool.com";
    const fallbackOgImage = `/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.primaryKeyword || (post.tags && post.tags.length > 0 ? post.tags[0] : "SEO"))}&v=2`;

    const publishedIso = new Date(post.createdAt).toISOString();
    const modifiedIso = new Date(post.updatedAt || post.createdAt).toISOString();

    return {
        title: seoTitle,
        description: seoDescription,
        authors: [{ name: "Sharik Rasool", url: `${baseUrl}/about` }],
        creator: "Sharik Rasool",
        publisher: "Sharik Rasool",
        alternates: { canonical: post.canonicalUrl || `${baseUrl}/blog/${post.slug}` },
        robots: post.robotsMeta || "index, follow",
        other: {
            "article:published_time": publishedIso,
            "article:modified_time": modifiedIso,
            "article:author": `${baseUrl}/about`,
            "author": "Sharik Rasool",
            "date": publishedIso,
            "last-modified": modifiedIso,
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: `${baseUrl}/blog/${post.slug}`,
            type: "article",
            publishedTime: publishedIso,
            modifiedTime: modifiedIso,
            authors: [`${baseUrl}/about`],
            tags: post.tags,
            images: (() => {
                let imgUrl = post.ogImage || post.coverImage || fallbackOgImage;
                if (imgUrl.startsWith("/")) {
                    imgUrl = `${baseUrl}${imgUrl}`;
                }
                return [{ url: imgUrl, width: 1200, height: 630, alt: post.title }];
            })(),
        },
        twitter: {
            card: "summary_large_image",
            title: seoTitle,
            description: seoDescription,
            creator: "@sharik_rasool",
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
    const articleImage = post.ogImage || post.coverImage
        || `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.primaryKeyword || (post.tags && post.tags.length > 0 ? post.tags[0] : "SEO"))}&v=2`;

    const publishedIso = new Date(post.createdAt).toISOString();
    const modifiedIso = new Date(post.updatedAt || post.createdAt).toISOString();

    const schemas: Record<string, unknown>[] = [];

    // 1. BlogPosting / Article Schema with Author Expertise and Content Dates
    schemas.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        image: [articleImage],
        datePublished: publishedIso,
        dateModified: modifiedIso,
        inLanguage: "en-US",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
        },
        author: {
            "@type": "Person",
            name: "Sharik Rasool",
            jobTitle: "Senior SEO & Link Building Specialist",
            url: `${baseUrl}/about`,
            sameAs: [
                "https://www.linkedin.com/in/sharik-rasool",
                "https://twitter.com/sharik_rasool",
                `${baseUrl}/about`
            ],
            description: "Senior freelance SEO strategist and manual outreach link builder with 8+ years experience scaling search rankings for SaaS and tech brands.",
            knowsAbout: [
                "Search Engine Optimization (SEO)",
                "Link Building",
                "Domain Rating Scaling",
                "Technical SEO Audits",
                "SaaS Organic Growth"
            ],
            image: `${baseUrl}/avatar-512.png`
        },
        publisher: {
            "@type": "Organization",
            name: "Sharik Rasool",
            url: baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/monogram-tile-512.png`
            }
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
        <>
            <AdminEditBanner postId={post._id} />
            <article className="section" itemScope itemType="https://schema.org/BlogPosting">
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

                    {(() => {
                        const titleEncoded = encodeURIComponent(post.title);
                        const categoryEncoded = encodeURIComponent(post.primaryKeyword || (post.tags && post.tags.length > 0 ? post.tags[0] : "SEO"));
                        let coverSrc = post.coverImage || `/api/og?title=${titleEncoded}&category=${categoryEncoded}`;
                        if (coverSrc.startsWith("/api/og")) {
                            coverSrc += "&v=2";
                        }
                        return (
                            <div className="mb-8 overflow-hidden rounded-2xl border border-border/80 shadow-md">
                                <Image
                                    src={coverSrc}
                                    alt={post.title}
                                    width={1200}
                                    height={630}
                                    priority
                                    loading="eager"
                                    fetchPriority="high"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="w-full h-auto max-h-[500px] object-contain bg-muted/10"
                                />
                            </div>
                        );
                    })()}

                    <header className="mb-8 space-y-5">
                        {post.tags.length > 0 && (
                            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                                <Tag className="h-3.5 w-3.5" />
                                <span>{post.tags[0]}</span>
                            </div>
                        )}
                        <h1 itemProp="headline" className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight text-foreground tracking-tight">
                            {post.title}
                        </h1>

                        {/* E-E-A-T Author Byline & Content Dates Bar */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs sm:text-sm text-muted-foreground border-y border-border/70 py-4">
                            {/* Author Byline */}
                            <Link
                                href="/about"
                                rel="author"
                                className="flex items-center gap-2.5 text-foreground font-semibold hover:text-primary transition-colors group"
                            >
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/30 bg-muted shrink-0 shadow-xs">
                                    <Image
                                        src="/avatar-512.png"
                                        alt="Sharik Rasool"
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span itemProp="author">Sharik Rasool</span>
                                    <span title="Verified SEO Specialist" className="inline-flex items-center">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    </span>
                                </div>
                            </Link>

                            <span className="hidden sm:inline text-muted-foreground/30">•</span>

                            {/* Publication Date */}
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary/80" />
                                <span>Published: </span>
                                <time
                                    dateTime={publishedIso}
                                    itemProp="datePublished"
                                    className="text-foreground/90 font-medium"
                                >
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </time>
                            </div>

                            {/* Updated Date */}
                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <>
                                    <span className="hidden sm:inline text-muted-foreground/30">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Updated: </span>
                                        <time
                                            dateTime={modifiedIso}
                                            itemProp="dateModified"
                                            className="text-foreground/90 font-medium"
                                        >
                                            {new Date(post.updatedAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </time>
                                    </div>
                                </>
                            )}

                            {/* Reading Time */}
                            {post.readingTime > 0 && (
                                <>
                                    <span className="hidden sm:inline text-muted-foreground/30">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{post.readingTime} min read</span>
                                    </div>
                                </>
                            )}

                            {/* Verified Editorial Signal */}
                            <div className="ml-auto hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Fact-Checked &amp; Verified</span>
                            </div>
                        </div>

                        {/* E-E-A-T Editorial Standard Banner */}
                        <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                                <span>
                                    <strong>Editorial Standards:</strong> Every strategy and case study is personally researched, executed, and verified by <Link href="/about" className="text-foreground font-semibold hover:underline">Sharik Rasool</Link>.
                                </span>
                            </div>
                            <div className="shrink-0 hidden sm:block text-[11px] font-bold text-primary">
                                8+ Years SEO Experience
                            </div>
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

                        {/* Sidebar / TOC & Conversion CTA */}
                        <aside className="hidden lg:block sticky top-24 space-y-6">
                            {showToc && <TableOfContents toc={toc} />}
                            <BlogSidebarCta />
                        </aside>
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

                    {/* E-E-A-T Author Bio Card to boost visible text and search authority */}
                    <div className="mt-16 border-t border-border pt-12">
                        <AuthorBio />
                    </div>
                </div>
            </article>
        </>
    );
}

