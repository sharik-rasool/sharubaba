import Link from "next/link";
import { 
  ShieldCheck, 
  Target, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Globe2,
  ExternalLink
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Manual Editorial Outreach",
    badge: "100% White-Hat",
    description: "No automated spam blasts or private blog networks (PBNs). Every single backlink is acquired through 1-on-1 personalized outreach to real webmasters, niche editors, and tier-1 tech publications.",
    benefits: [
      "DR 50 to DR 85+ authoritative domains",
      "Strict minimum 5,000+ monthly organic traffic",
      "Contextual in-content editorial links with custom anchors",
      "Full client pre-approval before pitch placement",
    ],
    highlightBg: "from-blue-500/10 via-indigo-500/5 to-transparent",
    accentColor: "text-blue-500",
  },
  {
    icon: Target,
    title: "Competitor Link Gap Strategy",
    badge: "High-Intent",
    description: "We reverse-engineer the top 3-5 ranking competitors for your primary commercial keywords in Ahrefs and SEMrush, identifying the high-authority links powering their rankings.",
    benefits: [
      "Targeted link-gap extraction for priority target URLs",
      "Replication of competitor's most authoritative link sources",
      "Targeting buyer-intent comparison and 'best of' listicles",
      "Outranking entrenched competitors in Google SERPs",
    ],
    highlightBg: "from-primary/10 via-emerald-500/5 to-transparent",
    accentColor: "text-primary",
  },
  {
    icon: Layers,
    title: "Topical Authority & Internal Clusters",
    badge: "Rank-Amplifier",
    description: "Backlinks alone are only half the battle. We structure your content hubs with topic cluster architecture to channel link equity seamlessly to your bottom-of-funnel (BOFU) high-converting landing pages.",
    benefits: [
      "Strategic internal anchor text optimization",
      "Topic cluster mapping to eliminate keyword cannibalization",
      "Maximized PageRank flow from high-DR backlinks",
      "Compound ranking growth across entire topical clusters",
    ],
    highlightBg: "from-amber-500/10 via-orange-500/5 to-transparent",
    accentColor: "text-amber-500",
  },
  {
    icon: Sparkles,
    title: "Data-Driven Digital PR & Link Magnets",
    badge: "Organic Magnet",
    description: "We engineer proprietary data studies, interactive tools, and industry benchmark reports that journalists, bloggers, and software reviewers naturally cite and link to organically.",
    benefits: [
      "Passive recurring backlink acquisition over time",
      "Tier-1 media mentions (Forbes, TechCrunch, HubSpot, etc.)",
      "Brand authority and thought leadership positioning",
      "Zero risk of Google algorithm devaluations or penalties",
    ],
    highlightBg: "from-purple-500/10 via-pink-500/5 to-transparent",
    accentColor: "text-purple-500",
  },
];

export function LinkBuildingPillars() {
  return (
    <section className="section bg-card/60 relative overflow-hidden border-y border-border/40" aria-labelledby="pillars-heading">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-wide">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Strategic SEO Methodology
            </div>
            <h2 id="pillars-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              How We Build Backlinks That <span className="text-primary">Actually Move Rankings</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              No private blog networks (PBNs), no low-quality directory spam, and no generic web 2.0 submissions. 
              We execute a battle-tested, data-driven link building playbook crafted exclusively for modern SaaS and tech brands.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <StaggerItem key={idx}>
              <div className="h-full rounded-2xl border border-border/60 bg-background/95 backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
                      <pillar.icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary border border-border text-foreground">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border/40 mb-6">
                    {pillar.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors group/link"
                  >
                    <span>See campaign case studies</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Banner with Quick CTA */}
        <FadeIn>
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-background to-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                Want to know which backlinks your competitors have that you don&apos;t?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Order a deep $15 manual SEO audit to get a complete competitor gap analysis within 24-48 hours.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link href="/seo-audit" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                  <span>Get $15 Competitor Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
