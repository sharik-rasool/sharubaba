import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import type { BlogDoc } from "@/lib/blogs";

interface RelatedArticlesProps {
    currentSlug: string;
    currentTags?: string[];
    currentTitle?: string;
    allPosts: BlogDoc[];
}

// 31 high-value articles that need strong internal link equity
const TARGET_UNINDEXED_SLUGS = new Set([
    "freelance-social-media-manager-tips",
    "saas-link-building-services",
    "content-outreach-link-building-boost-quality-backlinks",
    "building-link-customer-service-for-better-seo",
    "mastering-blogging-for-photographers-strategies-best-practices",
    "the-ultimate-guide-to-guest-blogging-for-seo-boosting-your-online-presence",
    "how-to-use-pinterest-for-blogging-traffic-and-success",
    "the-ultimate-guide-to-seo-without-link-building-strategies-and-techniques",
    "does-blogging-help-seo-a-comprehensive-guide-to-unlocking-search-engine-optimization-benefits",
    "blogging-strategy-key-tips",
    "blogging-dirty-secrets",
    "link-building-for-igaming-strategies-to-boost-rankings",
    "the-ultimate-guide-to-white-label-link-building-agencies",
    "ahrefs-blogging-for-business",
    "local-link-building-service",
    "boost-rankings-with-contextual-link-building-services",
    "link-building-for-lawyers",
    "how-to-start-freelancing-as-a-web-developer",
    "remote-freelancing-tips-for-developers",
    "backlink-outreach-services-how-to-get-authority-links",
    "how-to-write-a-freelancing-resume",
    "finding-and-succeeding-in-entry-level-blogging-jobs",
    "backlink-submission-high-impact-sites-and-strategies",
    "white-label-web-development-scaling-agency-growth",
    "the-ultimate-guide-to-starting-a-blog-for-beginners",
    "high-income-freelancing-skills",
    "how-to-stop-spam-blogging-and-protect-your-sites-reputation",
    "blogging-for-small-businesses-strategies-to-boost-growth",
    "local-seo-vs-traditional-seo-a-comprehensive-guide-to-link-building-and-google-maps-optimization",
    "the-ultimate-guide-to-outsourcing-link-building-benefits-costs-and-best-practices",
    "mastering-seo-strategies-for-local-business-a-comprehensive-guide",
]);

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function extractKeywords(title: string): string[] {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !["with", "from", "that", "this", "your", "what", "guide", "best"].includes(w));
}

export function RelatedArticles({
    currentSlug,
    currentTags = [],
    currentTitle = "",
    allPosts,
}: RelatedArticlesProps) {
    if (!allPosts || allPosts.length === 0) return null;

    const normalizedCurrentTags = currentTags.map((t) => t.toLowerCase().trim());
    const currentKeywords = extractKeywords(currentTitle);

    const candidates = allPosts.filter((p) => p.slug && p.slug !== currentSlug);

    const scored = candidates.map((post) => {
        let score = 0;

        // Tag overlap (highest weight)
        if (post.tags && post.tags.length > 0) {
            const postTagsLower = post.tags.map((t) => t.toLowerCase().trim());
            const sharedTags = postTagsLower.filter((t) => normalizedCurrentTags.includes(t));
            score += sharedTags.length * 4;
        }

        // Title keyword overlap
        const postKeywords = extractKeywords(post.title || "");
        const sharedKeywords = postKeywords.filter((w) => currentKeywords.includes(w));
        score += sharedKeywords.length * 2;

        // Boost target underlinked / unindexed articles so they get internal links from everywhere
        if (TARGET_UNINDEXED_SLUGS.has(post.slug)) {
            score += 3;
        }

        // Deterministic salt to distribute internal links cleanly across various posts
        const salt = (simpleHash(currentSlug + post.slug) % 100) / 100;
        score += salt;

        return { post, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const related = scored.slice(0, 3).map((s) => s.post);
    if (related.length === 0) return null;

    return (
        <section aria-label="Related Articles" className="mt-16 pt-12 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended Next Reads</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Related Articles &amp; Insights
                    </h2>
                </div>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                    <span>View all guides</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((article) => {
                    const primaryTag = article.tags && article.tags.length > 0 ? article.tags[0] : "SEO";
                    const titleEncoded = encodeURIComponent(article.title);
                    const categoryEncoded = encodeURIComponent(primaryTag);
                    const coverSrc = article.coverImage || `/api/og?title=${titleEncoded}&category=${categoryEncoded}`;

                    return (
                        <article
                            key={article.slug}
                            className="group flex flex-col rounded-2xl border border-border bg-card/60 hover:bg-card/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 overflow-hidden"
                        >
                            <Link href={`/blog/${article.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                <Image
                                    src={coverSrc}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-xs font-bold text-foreground border border-border/60">
                                        #{primaryTag.toUpperCase()}
                                    </span>
                                </div>
                            </Link>

                            <div className="flex flex-col flex-1 p-5">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {article.readingTime || 5} min read
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                                    <Link href={`/blog/${article.slug}`}>
                                        {article.title}
                                    </Link>
                                </h3>

                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                                    {article.excerpt || "Explore actionable strategies and proven tactics to elevate your organic search visibility."}
                                </p>

                                <Link
                                    href={`/blog/${article.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                                >
                                    <span>Read Guide</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
