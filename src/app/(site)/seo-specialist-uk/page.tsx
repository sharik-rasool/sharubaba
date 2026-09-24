import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  Code2,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Target,
  BarChart2,
  Workflow,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { LocationFAQAccordion, FAQItem } from "@/components/location/LocationFAQAccordion";
import { ToolLogosStrip } from "@/components/location/ToolLogosStrip";
import { SeoAuditLeadMagnet } from "@/components/location/SeoAuditLeadMagnet";

export const metadata: Metadata = {
  title: "SEO Specialist in UK | Freelance SEO Strategist & Consultant",
  description:
    "Senior freelance SEO specialist in the UK helping SaaS and tech companies scale organic MRR through technical SEO, content clusters, and high-impact search strategy.",
  alternates: {
    canonical: "https://www.sharikrasool.com/seo-specialist-uk",
  },
  openGraph: {
    title: "SEO Specialist in UK | Freelance SEO Strategist & Consultant",
    description:
      "Senior freelance SEO specialist in the UK helping SaaS and tech companies scale organic MRR through technical SEO, content clusters, and high-impact search strategy.",
    url: "https://www.sharikrasool.com/seo-specialist-uk",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "UK SEO Specialist - Sharik Rasool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Specialist in UK | Freelance SEO Strategist & Consultant",
    description:
      "Senior freelance SEO specialist in the UK helping SaaS and tech companies scale organic revenue through data-driven SEO.",
    images: ["/opengraph-image"],
  },
};

const ukSeoFaqs: FAQItem[] = [
  {
    question: "What does an SEO Specialist in the UK do for my business?",
    answer:
      "As a senior SEO specialist and strategist, I take full ownership of your organic search growth. This includes diagnosing deep technical crawl/indexation issues, identifying high-intent commercial keywords, building programmatic content hubs, optimizing for Google.co.uk and global search intent, and scaling high-authority backlinks to drive qualified demos, signups, and MRR.",
  },
  {
    question: "Why should I hire a freelance SEO specialist instead of a London SEO agency?",
    answer:
      "With a freelance specialist, you get senior-level strategic execution directly with the person doing the work—not outsourced to junior account managers. You get faster iteration speed, 100% transparent reporting, direct Slack communication, and typically 40%–60% lower costs than traditional London agency overhead.",
  },
  {
    question: "How do you tailor SEO strategies specifically for the UK market?",
    answer:
      "We analyze localized search trends on Google.co.uk, British English search terminology and intent variations, competitive SERP features, and build local UK publisher relationships while maintaining global topical authority for international software markets.",
  },
  {
    question: "Do you handle technical SEO and Core Web Vitals?",
    answer:
      "Yes. Technical SEO is the foundation of every campaign. I audit and optimize JavaScript rendering (Next.js, React, WordPress), crawl budget, dynamic XML sitemaps, canonical structures, schema markup, mobile responsiveness, and Core Web Vitals (LCP, INP, CLS) to ensure search bots index your high-value pages flawlessly.",
  },
  {
    question: "What is your pricing model for UK clients?",
    answer:
      "I offer transparent monthly consulting retainers in GBP (£), starting from £1,500/month for focused strategic advisory up to £3,500/month for comprehensive end-to-end SEO execution (technical, on-page content architecture, and link building). Invoicing is processed seamlessly via UK bank transfer, Stripe, or Wise.",
  },
  {
    question: "How quickly can we expect to see tangible organic traffic and revenue growth?",
    answer:
      "Technical fixes and quick-win keyword optimizations often produce noticeable ranking uplifts within the first 30 to 60 days. Comprehensive revenue and compounding organic pipeline growth typically accelerate between months 3 and 6 as new content hubs and backlink equity mature.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "UK SEO Specialist & Consulting - Sharik Rasool",
  description:
    "Senior freelance SEO specialist and organic search strategist helping UK SaaS and tech companies increase organic revenue through technical audits, content architecture, and authority building.",
  url: "https://www.sharikrasool.com/seo-specialist-uk",
  telephone: "+91-XXXXXXXXXX",
  priceRange: "£££",
  currenciesAccepted: "GBP, USD, EUR",
  paymentAccepted: "Bank Transfer, Stripe, Wise",
  areaServed: [
    {
      "@type": "Country",
      name: "United Kingdom",
      identifier: "GB",
    },
    {
      "@type": "AdministrativeArea",
      name: "London",
    },
    {
      "@type": "Country",
      name: "Global",
    },
  ],
  provider: {
    "@type": "Person",
    name: "Sharik Rasool",
    jobTitle: "Senior SEO Specialist & Organic Growth Strategist",
    url: "https://www.sharikrasool.com",
    sameAs: [
      "https://www.linkedin.com/in/sharik-rasool-074155174/",
      "https://www.instagram.com/growithsharik",
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ukSeoFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function SeoSpecialistUKPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION */}
      <section className="section relative overflow-hidden pt-12 sm:pt-20 lg:pt-28 pb-12">
        <style>{`
          .geo-hero-grid {
            background-image: 
              linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px);
            background-size: 32px 32px;
            mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
            -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
          }
        `}</style>
        <div className="absolute inset-0 geo-hero-grid opacity-70 pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-10 w-[240px] h-[240px] bg-primary/10 rounded-full blur-3xl -z-20 pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-20 pointer-events-none" />

        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Geo Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs md:text-sm font-semibold tracking-wide mb-6">
                <span className="text-base leading-none">🇬🇧</span>
                <span>Senior UK Organic Search Consultant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </FadeIn>

            {/* Main H1 */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 text-foreground">
                Senior SEO Specialist &{" "}
                <span className="relative inline-block text-primary">
                  Organic Search Strategist
                  <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
                </span>{" "}
                in the UK
              </h1>
            </FadeIn>

            {/* Subheading */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                Helping UK SaaS, fintech, and digital product brands dominate Google search. 7+ years turning organic search into an ARR-generating engine through technical precision, content architecture, and authority link acquisition.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.3} className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-md mx-auto">
                <Link href="#seo-audit" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full px-8 font-semibold gap-2 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base py-6">
                    <Search className="w-4 h-4" />
                    Get Free 15-Point Audit
                  </Button>
                </Link>
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="rounded-full px-8 font-semibold w-full sm:w-auto bg-background/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all text-base py-6">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Key Trust Metrics */}
            <FadeIn delay={0.4} className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-border/70 w-full mb-4">
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">7+ Years</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">SEO & Growth Experience</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">300%+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Avg Organic Traffic Growth</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">SaaS & B2B Brands Scaled</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">GBP Invoicing</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">London Timezone (GMT/BST)</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TOOL LOGOS STRIP */}
      <section className="border-b border-border/60 bg-muted/10">
        <ToolLogosStrip title="Audits & Strategies Executed With Industry-Standard Tooling" />
      </section>

      {/* LEAD MAGNET: FREE 15-POINT UK SEO AUDIT */}
      <SeoAuditLeadMagnet />

      {/* 2. THE 4 PILLARS OF MY UK SEO METHODOLOGY */}
      <section className="section bg-card/60 border-y border-border/60">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Full-Funnel Organic Search
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                The 4 Core Pillars of UK Search Dominance
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                We combine deep technical engineering with commercial keyword targeting to capture buyers at every stage of the funnel.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Technical SEO & Architecture</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Fixing crawl bloat, JavaScript rendering issues, dynamic sitemaps, canonical chains, and Core Web Vitals for maximum crawl efficiency.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">UK & Global Search Intent</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Identifying high-converting commercial & transactional keywords with real buyer intent on Google.co.uk and international SERPs.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Content Silos & Topical Authority</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Structuring internal link silos and programmatic content hubs that signal undeniable topical expertise to Google's semantic models.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">High-Authority Link Building</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Securing contextual editorial backlinks from DR50–85+ UK and global tech publications to outrank legacy competitors.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. FIXED GRID COMPARISON MATRIX */}
      <section className="section">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Smart Partnership
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Freelance SEO Specialist vs. London Agencies
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Get direct access to senior expertise without the high agency markups and slow bureaucratic communication.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-xl max-w-5xl mx-auto">
              <table className="w-full text-left text-sm table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-secondary/50">
                    <th className="w-[30%] p-4 sm:p-5 font-bold text-foreground">Comparison Area</th>
                    <th className="w-[35%] p-4 sm:p-5 font-extrabold text-primary bg-primary/5 border-x border-primary/20">
                      Sharik Rasool (Freelance Specialist)
                    </th>
                    <th className="w-[35%] p-4 sm:p-5 font-bold text-muted-foreground">
                      Typical London SEO Agency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Who Works On Your Site?
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>100% Senior Specialist (7+ yrs experience)</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Delegated to junior coordinators & interns</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Agility & Speed
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Direct implementation & rapid turnaround</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Weeks of internal agency approvals</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Cost Structure
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Transparent, zero London office overhead</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>£5,000–£10,000/mo to cover agency overhead</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Contract Flexibility
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Monthly rolling retainers, earn trust every month</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Strict 12-month lock-in contracts</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. THE 4-PHASE ORGANIC GROWTH ROADMAP */}
      <section className="section bg-muted/20 border-y border-border/60">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Proven Roadmap
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                How We Execute Your Organic Growth
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                A structured, data-driven framework that eliminates guesswork and builds sustainable search visibility.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                month: "Month 1",
                title: "Diagnostic & Quick Wins",
                desc: "Full technical audit, indexation fix, low-hanging keyword opportunities, and conversion architecture setup.",
              },
              {
                month: "Month 2",
                title: "Content Architecture",
                desc: "Competitor gap mapping, keyword cannibalization resolution, and production of high-intent topical hubs.",
              },
              {
                month: "Month 3",
                title: "Authority Scaling",
                desc: "Accelerating manual editorial outreach, digital PR pitching, and acquiring DR50–85+ contextual backlinks.",
              },
              {
                month: "Month 4+",
                title: "Compounding Pipeline",
                desc: "Scaling into secondary market verticals, programmatic pages, and conversion rate optimization (CRO) on top pages.",
              },
            ].map((phase, idx) => (
              <FadeIn key={phase.month} delay={idx * 0.1}>
                <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-primary px-3 py-1 rounded-full bg-primary/10 mb-4 inline-block">
                      {phase.month}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mb-2">{phase.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CROSS-LINKING SILO BANNER */}
      <section className="section py-8">
        <div className="container-wide">
          <FadeIn>
            <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  Dedicated Authority Building
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Looking Purely for Dedicated Backlink Acquisition?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  If your technical SEO and content are already solid, explore my standalone bespoke link building and manual digital outreach services in the UK.
                </p>
              </div>
              <Link href="/link-builder-uk" className="shrink-0 w-full md:w-auto">
                <Button variant="outline" className="rounded-full px-6 py-5 font-semibold gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all w-full md:w-auto">
                  View UK Link Building Specialist Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 6. INTERACTIVE UK SEO CONSULTING FAQS */}
      <LocationFAQAccordion
        title="UK SEO Specialist & Consulting FAQs"
        subtitle="Common questions about SEO strategy, technical execution, communication, and expected business outcomes."
        faqs={ukSeoFaqs}
      />

      {/* 7. FINAL CTA SECTION */}
      <section className="section relative overflow-hidden bg-primary/5 border-t border-border/70 py-16 sm:py-24">
        <div className="container-narrow text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              Start Scaling Your Organic Traffic
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Ready to Work with a Senior UK SEO Specialist?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a complimentary 30-minute organic growth consultation. We'll audit your current positioning, identify high-intent traffic leaks, and outline a prioritized execution roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-10 py-6 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all w-full sm:w-auto">
                  Book Your Strategy Call
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-full px-10 py-6 text-base font-semibold w-full sm:w-auto">
                  View Client Results
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
