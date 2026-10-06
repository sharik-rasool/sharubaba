"use client";

import { useState } from "react";
import {
  Globe,
  Search,
  TrendingUp,
  Link2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";

interface AuthorityData {
  domain: string;
  domainRating: number;
  ahrefsRank?: number;
  organicTraffic: number;
  trafficFormatted: string;
  referringDomains: number;
  backlinks: number;
  organicKeywords: number;
  authorityTier: string;
  healthScore: number;
  verdict: string;
  recommendation: string;
  source: 'live' | 'simulation';
  analyzedAt: string;
}

const SAMPLE_DOMAINS = [
  "stripe.com",
  "notion.so",
  "linear.app",
  "ahrefs.com",
  "sharikrasool.com",
];

export function WebsiteAuthorityCheckerTool() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthorityData | null>(null);

  const handleAnalyze = async (targetDomain?: string) => {
    const domainToTest = (targetDomain || domainInput).trim();
    if (!domainToTest) {
      setError("Please enter a domain or URL to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/domain-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainToTest }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to analyze domain. Please check the spelling and try again.");
        return;
      }

      setResult(json.data);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSampleSheet = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-sample-sheet-modal"));
    }
  };

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const currentDr = result ? result.domainRating : 0;
  const strokeDashoffset = circumference - (currentDr / 100) * circumference;

  const getDrColor = (dr: number) => {
    if (dr >= 80) return "text-emerald-400 stroke-emerald-500";
    if (dr >= 60) return "text-primary stroke-primary";
    if (dr >= 40) return "text-amber-400 stroke-amber-400";
    if (dr >= 20) return "text-orange-400 stroke-orange-400";
    return "text-rose-400 stroke-rose-400";
  };

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Ahrefs-Powered SEO Tool
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
          Website Authority &amp; <br />
          <span className="text-primary">Organic Traffic Checker</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Instantly check any website&apos;s <strong>Domain Rating (DR)</strong>, estimated monthly organic search traffic, and backlink authority. Uncover ranking power and growth gaps in seconds.
        </p>

        {/* DOMAIN INPUT BAR */}
        <div className="max-w-xl mx-auto pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-card border border-border/80 shadow-2xl focus-within:border-primary transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Globe className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter domain (e.g. stripe.com or yoursite.com)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full px-3 py-3 bg-transparent text-sm sm:text-base text-foreground focus:outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-7 py-6 font-bold text-sm shadow-lg shadow-primary/20 gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Authority
                </>
              )}
            </Button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <span className="font-semibold">Try examples:</span>
            {SAMPLE_DOMAINS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setDomainInput(sample);
                  handleAnalyze(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-primary/40 text-foreground transition-all duration-200"
              >
                {sample}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS DASHBOARD */}
      {result && (
        <FadeIn>
          <div className="max-w-5xl mx-auto rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-10 space-y-10 relative overflow-hidden">
            {/* Top Bar: Target Domain & Source */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Domain Overview
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
                  <span>{result.domain}</span>
                  <a
                    href={`https://${result.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{result.authorityTier}</span>
              </div>
            </div>

            {/* Main Stats Grid with Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Circular DR Gauge (Left Column) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/30 border border-border/60 text-center relative">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                    {/* Background Track */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-muted/40"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className={`${getDrColor(result.domainRating)} transition-all duration-1000 ease-out`}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground tracking-tight">
                      {result.domainRating}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Domain Rating
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-xs font-bold text-foreground">
                    Scale: 0 (Low) to 100 (Elite)
                  </div>
                  {result.ahrefsRank && (
                    <div className="text-[11px] text-muted-foreground">
                      Ahrefs Rank: <strong className="text-foreground">#{result.ahrefsRank.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Metric Cards (Right Column) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traffic */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Organic Traffic
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.trafficFormatted}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Estimated monthly search visits from Google
                  </div>
                </div>

                {/* Referring Domains */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Referring Domains
                    </span>
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.referringDomains.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Unique websites linking to this domain
                  </div>
                </div>

                {/* Total Backlinks */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Total Backlinks
                    </span>
                    <Link2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.backlinks.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Cumulative live editorial and in-content links
                  </div>
                </div>

                {/* Ranked Keywords */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Organic Keywords
                    </span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.organicKeywords.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Keywords ranking in Google top 100 search results
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Analysis & Growth Recommendation */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-muted/40 to-muted/20 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>SEO Authority Verdict &amp; Strategic Roadmap</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Current Status:</strong> {result.verdict}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Next Link Building Step:</strong> {result.recommendation}
              </p>
            </div>

            {/* Conversion CTA Block */}
            <div className="p-8 rounded-3xl bg-card border border-border/80 text-center space-y-6">
              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Want to Increase Your Domain Rating to 70+?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  I help SaaS and tech companies acquire high-DR contextual backlinks through 100% white-hat manual outreach.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenSampleSheet}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-98"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>View 50+ Live Backlink Sample Sheet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://calendly.com/sharikkashmiri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs border border-border/60 transition-colors"
                >
                  <span>Book Free Strategy Call</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* COMPREHENSIVE SEO CONTENT GUIDE */}
      <section className="max-w-4xl mx-auto space-y-12 pt-8 border-t border-border/60">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            What is Ahrefs Domain Rating (DR)?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            <strong>Domain Rating (DR)</strong> is a proprietary SEO metric developed by Ahrefs that measures the strength and quality of a website’s overall backlink profile on a logarithmic scale from <strong>0 to 100</strong>. Unlike raw backlink counts, DR focuses heavily on the <em>equity and authority</em> of the referring websites pointing to your domain.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A website with a higher Domain Rating generally finds it substantially easier to rank for competitive, high-volume search queries because Google and other search engines view backlink equity as one of the strongest votes of confidence and topical authority on the web.
          </p>
        </div>

        {/* DR TIERS BREAKDOWN */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Understanding Domain Rating Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  DR 80–100
                </span>
                <span className="text-xs text-muted-foreground font-bold">Elite Enterprise</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">Industry Giants &amp; Category Leaders</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Domains like Stripe, GitHub, Notion, and HubSpot. They can publish a new piece of content and rank on Page 1 within hours due to massive historical backlink trust.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  DR 60–79
                </span>
                <span className="text-xs text-muted-foreground font-bold">Established Brands</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">High-Authority Scale-Ups &amp; SaaS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Competitive market leaders with solid link foundations capable of winning mid-to-high competition commercial keyword SERPs against established incumbents.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                  DR 40–59
                </span>
                <span className="text-xs text-muted-foreground font-bold">Mid-Market SaaS</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">Growing Product Companies</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solid organic traction. Needs consistent monthly manual outreach to break into the DR60+ bracket and capture enterprise search volume.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                  DR 0–39
                </span>
                <span className="text-xs text-muted-foreground font-bold">Early Stage</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">New Websites &amp; Bootstrapped Ventures</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Minimal backlink equity. Requires a focused 3–6 month link building sprint to acquire foundational DR50+ guest posts, partner mentions, and resource citations.
              </p>
            </div>
          </div>
        </div>

        {/* 5 WAYS TO INCREASE DR */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            5 Proven Strategies to Increase Your Domain Rating in 2026
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-foreground">Manual Editorial Guest Posting:</strong> Secure in-content editorial mentions on authoritative industry publications in your exact niche.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-foreground">Competitor Link Gap Acquisition:</strong> Extract referring domains that link to your top 3 competitors and pitch better, updated statistics or alternatives.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-foreground">Linkable Asset Creation:</strong> Publish proprietary industry surveys, benchmarking data, or free interactive calculators that naturally attract editorial links.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <strong className="text-foreground">Digital PR &amp; Expert Commentary:</strong> Provide expert quotes to journalists on platforms like Connectively, Featured, and Qwoted to earn DR70–90+ media links.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                5
              </div>
              <div>
                <strong className="text-foreground">Fix Broken Backlinks &amp; 301 Reclaim:</strong> Audit 404 pages on your website that still possess inbound backlinks and redirect them to active relevant pages to preserve lost link equity.
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="dr-faq-1" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How often does Ahrefs update Domain Rating (DR)?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                Ahrefs continuously recrawls the web and calculates Domain Rating dynamically. As new backlinks are indexed or lost backlinks are removed from their web graph, a domain’s DR metric adjusts accordingly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-2" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                What is the difference between Domain Rating (DR) and Moz Domain Authority (DA)?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                While both metrics measure backlink authority on a 0–100 scale, Ahrefs DR isolates pure link equity (unique referring domains and their relative authority), whereas Moz DA attempts to predict search engine ranking probability using a broader machine-learning model.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-3" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                Does a higher Domain Rating guarantee #1 rankings in Google?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                No single metric guarantees top rankings. Google evaluates search intent, content quality, page speed, technical SEO, and user experience alongside backlink authority. However, high DR gives pages a decisive competitive advantage in competitive search markets.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-4" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How can I hire a specialist to build high-DR backlinks for my SaaS?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                You can book a custom link building consultation directly with Sharik Rasool. We specialize in 100% white-hat manual outreach, contextual SaaS placements, and customized DR growth sprints.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
