import type { Metadata } from "next";
import Link from "next/link";
import {
  Link2,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Globe2,
  Clock,
  Sparkles,
  Award,
  Search,
  FileText,
  Send,
  BarChart3,
  Check,
  HelpCircle,
  ExternalLink,
  FileSpreadsheet,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { LocationFAQAccordion, FAQItem } from "@/components/location/LocationFAQAccordion";
import { ToolLogosStrip } from "@/components/location/ToolLogosStrip";
import { LinkCostEstimator } from "@/components/location/LinkCostEstimator";
import { LinkSampleSheetLeadMagnet } from "@/components/location/LinkSampleSheetLeadMagnet";

export const metadata: Metadata = {
  title: "Link Building Specialist in UK | Freelance Link Builder",
  description:
    "Hire a senior freelance link building specialist in the UK. Secure high-authority DR50+ editorial backlinks on real UK & global sites to scale your organic search rankings.",
  alternates: {
    canonical: "https://www.sharikrasool.com/link-builder-uk",
  },
  openGraph: {
    title: "Link Building Specialist in UK | Freelance Link Builder",
    description:
      "Hire a senior freelance link building specialist in the UK. Secure high-authority DR50+ editorial backlinks on real UK & global sites to scale your organic search rankings.",
    url: "https://www.sharikrasool.com/link-builder-uk",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "UK Link Building Specialist - Sharik Rasool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Building Specialist in UK | Freelance Link Builder",
    description:
      "Hire a senior freelance link building specialist in the UK. Secure high-authority DR50+ editorial backlinks on real UK & global publications.",
    images: ["/opengraph-image"],
  },
};

const ukLinkBuildingFaqs: FAQItem[] = [
  {
    question: "Why should UK businesses work with a dedicated link building specialist?",
    answer:
      "Unlike generic SEO agencies that outsource outreach or resell low-quality link lists, a dedicated freelance link building specialist creates bespoke, manual outreach campaigns. You get direct access to the strategist, 100% pre-approval on every domain before publishing, and tailored outreach targeting UK-relevant (.co.uk) and authoritative global publications in your exact niche.",
  },
  {
    question: "Do you build links on genuine UK websites and publications?",
    answer:
      "Yes. Depending on your target audience, we pitch and secure contextual editorial placements on legitimate UK industry publications, regional tech hubs, business portals, and high-authority global SaaS blogs with real organic search traffic.",
  },
  {
    question: "What are your minimum quality criteria for backlink placements?",
    answer:
      "Every prospective domain is rigorously vetted against strict standards: Minimum Domain Rating (DR 50+), 5,000+ monthly organic traffic verified on Ahrefs/Semrush, zero spam score, healthy backlink profile, and real editorial moderation. We never use PBNs, link farms, or sponsored guest post networks.",
  },
  {
    question: "Do I get to approve prospective websites before you pitch them?",
    answer:
      "Yes! Transparency is core to my methodology. You receive a prospective target list with full domain metrics (DR, organic traffic, topical relevance) for review and pre-approval before any outreach or content creation begins.",
  },
  {
    question: "Do you invoice in British Pounds (GBP £) and operate on UK time?",
    answer:
      "Yes. Invoicing is available directly in GBP (£) via standard UK bank transfer, Stripe, or Wise. Communication and status calls are aligned with UK working hours (GMT / BST).",
  },
  {
    question: "How long does it take to see organic ranking improvements from link building?",
    answer:
      "High-authority editorial links typically begin passing algorithmic link equity within 4 to 8 weeks after indexing. For moderately competitive keywords, clients usually see noticeable rank increases within 60 to 90 days of consistent backlink acquisition.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "UK Link Building Specialist & Outreach Consultant - Sharik Rasool",
  description:
    "Bespoke white-hat link building, manual editorial outreach, and high-DR backlink acquisition for UK SaaS, B2B, and technology companies.",
  url: "https://www.sharikrasool.com/link-builder-uk",
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
      "@type": "AdministrativeArea",
      name: "Manchester",
    },
    {
      "@type": "Country",
      name: "Global",
    },
  ],
  provider: {
    "@type": "Person",
    name: "Sharik Rasool",
    jobTitle: "Senior SEO Strategist & Link Building Specialist",
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
  mainEntity: ukLinkBuildingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function LinkBuilderUKPage() {
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
                <span>UK & Global Outreach Specialist</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </FadeIn>

            {/* Main H1 */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 text-foreground">
                Senior Link Building Specialist &{" "}
                <span className="relative inline-block text-primary">
                  Freelance Link Builder
                  <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
                </span>{" "}
                in the UK
              </h1>
            </FadeIn>

            {/* Subheading */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                Securing high-authority, DR50+ editorial backlinks that move the needle for UK tech, SaaS, and high-growth B2B brands. 100% manual outreach, zero PBNs, complete placement pre-approval, and transparent pricing in GBP (£).
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.3} className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-md mx-auto">
                <Link href="#cost-estimator" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full px-8 font-semibold gap-2 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all text-base py-6">
                    <Calculator className="w-4 h-4" />
                    Estimate Link Building Cost
                  </Button>
                </Link>
                <Link href="#sample-sheet" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="rounded-full px-8 font-semibold w-full sm:w-auto bg-background/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all text-base py-6 gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-primary" />
                    View Live Sample Placements
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Key Trust Metrics */}
            <FadeIn delay={0.4} className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-border/70 w-full mb-4">
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">DR50–85+ Links Built</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">White-Hat Manual Outreach</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">0%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">Zero PBNs / Link Farms</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">GMT / BST</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">UK Timezone Aligned</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TOOL LOGOS STRIP */}
      <section className="border-b border-border/60 bg-muted/10">
        <ToolLogosStrip title="Verified Across Industry-Standard SEO & Outreach Platforms" />
      </section>

      {/* LEAD MAGNET 1: INTERACTIVE LINK COST ESTIMATOR */}
      <LinkCostEstimator />

      {/* 2. THE UK LINK BUILDING ADVANTAGE */}
      <section className="section bg-card/60 border-y border-border/60">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                  Why UK Brands Need a Specialist
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-5">
                  Stop Buying Cheap Link Lists. Build Real Digital Authority.
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mb-6 leading-relaxed">
                  In competitive UK search markets, Google’s algorithms ruthlessly filter out generic sponsored posts, PBNs, and low-grade directory spam. To outrank established competitors in London, Manchester, and across the UK, you need **contextual editorial mentions on authoritative, traffic-generating domains**.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium">
                      <strong>Targeted .co.uk & Global Publications:</strong> Connect with authentic publishers that matter to your buyer persona.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium">
                      <strong>Full Pre-Approval Rights:</strong> You review and approve the target website, DR, traffic, and content angle prior to outreach.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-medium">
                      <strong>Direct Founder Collaboration:</strong> No junior account managers or endless agency layers. You work 1-on-1 with an expert.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn delay={0.2}>
                <div className="p-6 sm:p-8 rounded-3xl bg-secondary/30 border border-border/80 shadow-lg space-y-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Strict Quality Criteria on Every Placement
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-card border border-border/60">
                      <div className="font-semibold text-foreground mb-1">Domain Rating (DR)</div>
                      <div className="text-muted-foreground">DR 50 to DR 85+ (Ahrefs verified)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60">
                      <div className="font-semibold text-foreground mb-1">Organic Search Traffic</div>
                      <div className="text-muted-foreground">Minimum 5,000+ real monthly visitors</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60">
                      <div className="font-semibold text-foreground mb-1">Topical Relevance</div>
                      <div className="text-muted-foreground">100% contextual fit within your niche</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60">
                      <div className="font-semibold text-foreground mb-1">Permanent & Dofollow</div>
                      <div className="text-muted-foreground">In-content editorial contextual link</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET 2: LIVE BACKLINK SAMPLE SHEET */}
      <LinkSampleSheetLeadMagnet />

      {/* 3. THE 5-STEP LINK BUILDING METHODOLOGY */}
      <section className="section">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Bespoke Outreach Workflow
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                How I Secure Top-Tier Backlinks for Your Brand
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                A repeatable, relationship-driven outreach process engineered for maximum authority and zero algorithmic risk.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                icon: Search,
                title: "Competitor Gap Audit",
                desc: "We analyze the backlink profiles of top UK and global ranking competitors to discover high-yield link opportunities.",
              },
              {
                step: "02",
                icon: FileText,
                title: "Asset & Angle Crafting",
                desc: "We identify or create linkable assets, data studies, expert commentary, or thought leadership content tailored to UK editors.",
              },
              {
                step: "03",
                icon: ShieldCheck,
                title: "Client Pre-Approval",
                desc: "You review and approve every target domain, DR metric, and pitch topic in advance. Zero surprises.",
              },
              {
                step: "04",
                icon: Send,
                title: "Personalized Outreach",
                desc: "We pitch real journalists, editors, and site owners with 1-to-1 customized value propositions (no mass generic spam).",
              },
              {
                step: "05",
                icon: BarChart3,
                title: "Publish & Index Check",
                desc: "We verify the live in-content dofollow link, ensure proper indexing in Google, and deliver full monthly reporting.",
              },
            ].map((item, idx) => (
              <FadeIn key={item.step} delay={idx * 0.1}>
                <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-extrabold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                        STEP {item.step}
                      </span>
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FIXED GRID COMPARISON MATRIX */}
      <section className="section bg-muted/20 border-y border-border/60">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Freelance Link Specialist vs. Agency Resellers
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Why forward-thinking UK marketing teams choose a dedicated link building specialist over opaque agency retainers.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-xl max-w-5xl mx-auto">
              <table className="w-full text-left text-sm table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-secondary/50">
                    <th className="w-[30%] p-4 sm:p-5 font-bold text-foreground">Comparison Criteria</th>
                    <th className="w-[35%] p-4 sm:p-5 font-extrabold text-primary bg-primary/5 border-x border-primary/20">
                      Sharik Rasool (UK Specialist)
                    </th>
                    <th className="w-[35%] p-4 sm:p-5 font-bold text-muted-foreground">
                      Typical Link Reseller Agency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Outreach Method
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>100% Manual, 1-to-1 relationship pitching</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Mass automated spam to pre-paid link farms</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Domain Pre-Approval
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Full domain & content angle pre-approval</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Blind placements delivered after publication</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Traffic Threshold
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Strict 5,000+ verified monthly organic traffic</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Zero-traffic recycled sites with fake DR</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Communication & Timezone
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Direct Slack / London time (GMT/BST) syncs</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>Slow ticket systems via junior account reps</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      Invoicing & Currency
                    </td>
                    <td className="p-4 sm:p-5 bg-primary/5 border-x border-primary/20">
                      <div className="flex items-start gap-2.5 text-foreground font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>GBP (£) invoices, zero FX or bank surprises</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-2.5 text-muted-foreground">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>High agency markups + strict 6-12 mo contracts</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. PRICING & RETAINER TIERS IN GBP (£) */}
      <section className="section">
        <div className="container-wide">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                Clear & Predictable Investment
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                UK Link Building Retainers & Packages (£)
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Transparent monthly retainers with no hidden fees, long-term contracts, or low-tier link compromises.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tier 1: Growth */}
            <FadeIn delay={0.1}>
              <div className="p-8 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Startup / Focused</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Growth Tier</h3>
                  <p className="text-sm text-muted-foreground mb-6">Ideal for targeting 1-2 core commercial service pages or initial DR acceleration.</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">
                    £1,250 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="space-y-3 text-sm text-foreground mb-8">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <strong>4–5 High-Authority Backlinks</strong>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      DR 50 to DR 70+ Domains
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      5,000+ Verified Organic Traffic
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      100% Pre-Approval Rights
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      Monthly Performance Dashboard
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full rounded-full font-semibold py-5">
                    Choose Growth
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Tier 2: Scale (Highlighted) */}
            <FadeIn delay={0.2}>
              <div className="p-8 rounded-3xl bg-card border-2 border-primary shadow-xl shadow-primary/10 relative flex flex-col justify-between h-full scale-100 lg:scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold tracking-wider uppercase shadow-md">
                  Most Popular for SaaS
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Scale & Dominance</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Authority Scale</h3>
                  <p className="text-sm text-muted-foreground mb-6">For high-growth SaaS and B2B brands competing in high-CPC UK search verticals.</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">
                    £2,450 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="space-y-3 text-sm text-foreground mb-8">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <strong>8–10 High-Authority Backlinks</strong>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      DR 60 to DR 85+ Tier-1 Domains
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      10,000+ Verified Organic Traffic
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      Dedicated Competitor Link Intersect
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      Direct Slack Channel & Bi-Weekly Syncs
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="w-full">
                  <Button className="w-full rounded-full font-semibold py-5 shadow-lg shadow-primary/20">
                    Get Started with Scale
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Tier 3: Enterprise / Custom */}
            <FadeIn delay={0.3}>
              <div className="p-8 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Enterprise / Agency Partner</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Custom Retainer</h3>
                  <p className="text-sm text-muted-foreground mb-6">Custom high-volume or white-label link building for UK agencies and enterprises.</p>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">
                    Custom <span className="text-sm font-normal text-muted-foreground">/ bespoke</span>
                  </div>
                  <ul className="space-y-3 text-sm text-foreground mb-8">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <strong>15+ Editorial Placements / Mo</strong>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      Custom UK & International GEO Split
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      White-Label Client Reporting for Agencies
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      Priority Editorial Pipeline
                    </li>
                  </ul>
                </div>
                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full rounded-full font-semibold py-5">
                    Inquire Custom Plan
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 6. CROSS-LINKING SILO BANNER */}
      <section className="section py-8">
        <div className="container-wide">
          <FadeIn>
            <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  Complete Organic Strategy
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Need Full-Funnel SEO Alongside Backlink Building?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Backlinks perform best when built on an optimized technical architecture and programmatic content hubs. Explore my dedicated UK SEO strategy consulting.
                </p>
              </div>
              <Link href="/seo-specialist-uk" className="shrink-0 w-full md:w-auto">
                <Button variant="outline" className="rounded-full px-6 py-5 font-semibold gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all w-full md:w-auto">
                  View UK SEO Specialist Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. INTERACTIVE UK LINK BUILDING FAQS */}
      <LocationFAQAccordion
        title="UK Link Building Specialist FAQs"
        subtitle="Frequently asked questions about manual outreach, domain quality criteria, GBP pricing, and delivery timelines."
        faqs={ukLinkBuildingFaqs}
      />

      {/* 8. FINAL CTA SECTION */}
      <section className="section relative overflow-hidden bg-primary/5 border-t border-border/70 py-16 sm:py-24">
        <div className="container-narrow text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              Let's Scale Your Domain Rating
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Ready to Win Page 1 Rankings in the UK?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a free 30-minute link building strategy session. We'll examine your current backlink profile, identify competitor gaps, and build a tailored outreach roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-10 py-6 text-base font-bold shadow-xl shadow-primary/25 hover:shadow-primary/35 transition-all w-full sm:w-auto">
                  Get in Touch Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="rounded-full px-10 py-6 text-base font-semibold w-full sm:w-auto">
                  Explore Case Studies
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
