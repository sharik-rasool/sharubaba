import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Link2,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Target,
  Zap,
  BarChart3,
  Globe2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";
import { SeoAuditOrderForm } from "@/components/audit/SeoAuditOrderForm";
import { SeoAuditPreviewWidget } from "@/components/audit/SeoAuditPreviewWidget";
import { SeoAuditHeroVisual } from "@/components/audit/SeoAuditHeroVisual";

export const metadata: Metadata = {
  title: "In-Depth SEO & Backlink Audit ($15) | Data-Backed Growth Roadmap",
  description:
    "Get an executive-ready SEO & backlink audit for just $15. Includes Ahrefs domain health metrics, competitor link gap analysis, top countries breakdown, and a custom 90-day action plan.",
  alternates: {
    canonical: "https://www.sharikrasool.com/seo-audit",
  },
  openGraph: {
    title: "In-Depth SEO & Backlink Audit ($15) | Sharik Rasool",
    description:
      "Get an executive-ready SEO & backlink audit for just $15. Delivered in 24–48 hours in PDF & Excel format with prioritized growth recommendations.",
    url: "https://www.sharikrasool.com/seo-audit",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "$15 SEO & Backlink Audit - Sharik Rasool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "In-Depth SEO & Backlink Audit ($15) | Sharik Rasool",
    description:
      "Get an executive-ready SEO & backlink audit for just $15. Delivered in 24–48 hours in PDF & Excel format.",
    images: ["/opengraph-image"],
  },
};

const auditFaqs = [
  {
    question: "What exactly do I receive in my $15 SEO audit?",
    answer:
      "You receive two tailored deliverables: (1) An Executive PDF Audit Report summarizing your Domain Rating, organic traffic trends, geographical audience breakdown, and strategic link health, and (2) An Actionable Excel / Google Sheet detailing your competitor backlink gaps, broken link reclamation opportunities, and a prioritized 90-day execution checklist.",
  },
  {
    question: "How is this different from automated free SEO audit tools?",
    answer:
      "Automated free scanners output generic, boilerplate technical checklists. Our $15 audit is powered by live Ahrefs enterprise data and personally curated to highlight your exact backlink deficits, high-DR competitor link gaps, and practical commercial search opportunities tailored to your niche.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Your completed audit report and action sheet will be delivered directly to your email inbox within 24 to 48 business hours after submission.",
  },
  {
    question: "What if I decide to hire you for link building later?",
    answer:
      "100% of your $15 audit fee is credited directly toward your first monthly link building sprint or custom outreach campaign. You lose nothing.",
  },
  {
    question: "What if my website is brand new (DR 0–20)?",
    answer:
      "The audit is especially valuable for new and emerging websites. We will map out foundational link building opportunities, founder interview PR targets, and the exact initial DR50+ guest post placements required to build organic search momentum.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes. If your audit report does not provide at least 3 clear, actionable insights to improve your organic rankings and backlink profile, let me know and I will refund your $15 in full — no questions asked.",
  },
];

const auditProductSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Custom $15 SEO & Backlink Audit Report",
  image: "https://www.sharikrasool.com/opengraph-image",
  description:
    "Data-backed custom SEO and backlink audit report powered by Ahrefs enterprise data. Delivered in 24-48 hours in PDF and Excel format.",
  brand: {
    "@type": "Person",
    name: "Sharik Rasool",
  },
  offers: {
    "@type": "Offer",
    url: "https://www.sharikrasool.com/seo-audit",
    priceCurrency: "USD",
    price: "15.00",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2027-12-31",
  },
};

export default function SeoAuditPage() {
  return (
    <div className="min-h-screen py-12 sm:py-20 space-y-24">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auditProductSchema) }}
      />

      {/* 1. HERO SECTION (2-Column with 3D Animated Book) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Data-Backed Productized Service • $15 Flat
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              Uncover Why Competitors Outrank You. <br />
              <span className="text-primary">Get a Custom $15 SEO Audit.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop guessing your website&apos;s SEO weaknesses. Get an executive PDF report and Excel action sheet with your exact backlink gaps, traffic distribution, and a prioritized 90-day growth roadmap.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#order-audit-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
              >
                <span>Order Your $15 Audit</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#preview-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm border border-border/80 transition-colors"
              >
                <span>Free Baseline Scan</span>
                <Zap className="w-4 h-4 text-primary" />
              </a>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>24–48h Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Powered by Ahrefs API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>100% Credited to Link Building</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Audit Book Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <SeoAuditHeroVisual />
          </div>
        </div>
      </section>

      {/* 2. FREE LIVE PREVIEW WIDGET */}
      <section id="preview-section" className="max-w-4xl mx-auto px-4 sm:px-6">
        <SeoAuditPreviewWidget />
      </section>

      {/* 3. WHAT YOU GET INSIDE THE $15 AUDIT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
            What’s Included in Your $15 Audit Report
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A comprehensive, actionable breakdown designed to help you outrank competitors and scale domain authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Domain Health & Backlink Equity */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              1. Domain Health &amp; Authority Scorecard
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Complete evaluation of your Ahrefs Domain Rating (DR), global Ahrefs Rank, referring domains velocity, and dofollow vs. nofollow ratio. Identify toxic links or anchor text imbalances holding you back.
            </p>
            <ul className="space-y-2 text-xs text-foreground/90 pt-2 border-t border-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>True Domain Rating &amp; Historical Authority Trajectory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Referring Domains vs. Total Backlinks Ratio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anchor Text Diversity &amp; Over-Optimization Risk</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Traffic & Geographic Audience */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              2. Organic Traffic &amp; Geo-Distribution
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Detailed breakdown of estimated monthly Google organic search traffic, ranked keywords distribution (Top 3, Top 10, Top 100), and top 5 countries driving your visits.
            </p>
            <ul className="space-y-2 text-xs text-foreground/90 pt-2 border-t border-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Top 5 Countries Organic Traffic Breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Keyword Ranking Spread (Positions 1-3 vs 4-10)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Commercial vs. Informational Search Traffic Value</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Competitor Link Gap Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              3. Competitor Link Gap Matrix
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We extract high-DR referring domains that link to your top 1–2 direct competitors but have not yet linked to you. These represent your fastest link building wins.
            </p>
            <ul className="space-y-2 text-xs text-foreground/90 pt-2 border-t border-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Top 10 High-Value Competitor Link Opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Domain Authority &amp; Traffic Scores per Target</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Contextual Outreach Angle for Each Target</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Prioritized 90-Day Action Blueprint */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4 hover:border-primary/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              4. Prioritized 90-Day Action Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A sequential roadmap with 5 prioritized steps to execute this quarter. Focus on high-impact changes that move the needle instead of getting bogged down in low-value SEO noise.
            </p>
            <ul className="space-y-2 text-xs text-foreground/90 pt-2 border-t border-border/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Immediate 404 &amp; Broken Link Reclamation Targets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Targeted DR50+ SaaS Guest Post Placement Roadmap</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Quarterly Authority Benchmark Goals (DR Growth Targets)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. DELIVERABLES PREVIEW CARDS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-secondary/40 via-card to-card border border-border/80 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Deliverable Formats
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Executive PDF Deck + Interactive Excel Action Sheet
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ready to present to your leadership team or hand off directly to your content &amp; SEO team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Mockup Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm sm:text-base">
                    Executive Audit Deck (PDF)
                  </h4>
                  <span className="text-[11px] text-muted-foreground">8–12 Page Comprehensive Report</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clean, beautifully formatted summary with visualizations of your Domain Rating, top country traffic breakdown, backlink toxicity score, and high-level strategic roadmap.
              </p>
            </div>

            {/* Excel Mockup Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm sm:text-base">
                    Action Tracker (Excel / Sheets)
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Interactive Work Tracker</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Raw data table with verified competitor link opportunities, URL targets, DR metrics, broken 404 redirect targets, and interactive task checkboxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ORDER INTAKE FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <SeoAuditOrderForm />
      </section>

      {/* 6. RISK-FREE CREDIT GUARANTEE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-primary/10 border border-primary/25 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            The 100% Risk-Free Guarantee &amp; Retainer Credit
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            If you decide to partner with me for a monthly link building sprint within 30 days of receiving your audit, your entire <strong className="text-foreground">$15 audit fee is 100% credited</strong> toward your package.
          </p>
          <div className="pt-2">
            <a
              href="https://calendly.com/sharikkashmiri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Have questions before ordering? Book a quick 15-min call</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Everything you need to know about the $15 custom SEO audit.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {auditFaqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-border/60 rounded-2xl bg-card px-6"
            >
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
