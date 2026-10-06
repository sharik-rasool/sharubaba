import Link from "next/link";
import { Check, X, Shield, Sparkles, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/animations";

const comparisonRows = [
  {
    feature: "Link Prospecting & Outreach",
    agency: "Automated bulk email blasts & generic scraped lists",
    specialist: "100% manual, personalized 1-on-1 editorial outreach",
  },
  {
    feature: "Domain Quality & Traffic Verification",
    agency: "Low-traffic PBNs, link farms, or inflated domain metrics",
    specialist: "Strict DR 50-85+ vetted domains with verified real search traffic",
  },
  {
    feature: "Client Pre-Approval",
    agency: "Black-box approach — links placed without prior client consent",
    specialist: "100% pre-approval — you review and approve every domain & anchor",
  },
  {
    feature: "Who Actually Executes Your Strategy?",
    agency: "Junior interns or outsourced overseas sub-contractors",
    specialist: "Direct senior specialist (Sharik Rasool) handling every campaign",
  },
  {
    feature: "Contract Commitments",
    agency: "Rigid 6 to 12-month lock-in contracts with hidden fees",
    specialist: "Flexible monthly sprint model with zero lock-in contracts",
  },
  {
    feature: "Deliverables & Reporting",
    agency: "Vague monthly summaries with zero live tracker transparency",
    specialist: "Live Google Sheet dashboard with live URL indexing verification",
  },
];

export function AgencyComparisonSection() {
  return (
    <section className="section relative overflow-hidden" aria-labelledby="comparison-heading">
      <div className="container-wide">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              The Specialist Advantage
            </div>
            <h2 id="comparison-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              Why SaaS Founders Choose a <span className="text-primary">Dedicated Specialist</span> Over Agencies
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Traditional SEO agencies rely on junior staff, 300% markup link brokers, and opaque reports. 
              Here is how working directly with an experienced SEO strategist transforms your organic acquisition.
            </p>
          </div>
        </FadeIn>

        {/* Comparison Table / Grid */}
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-border bg-muted/40 font-bold text-sm">
              <div className="p-4 md:p-6 md:col-span-4 text-muted-foreground uppercase text-xs tracking-wider flex items-center">
                Strategy &amp; Execution Standard
              </div>
              <div className="p-4 md:p-6 md:col-span-4 border-t md:border-t-0 md:border-l border-border bg-destructive/5 text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <span>Typical Reseller Agency</span>
              </div>
              <div className="p-4 md:p-6 md:col-span-4 border-t md:border-t-0 md:border-l border-border bg-primary/10 text-foreground flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-primary font-extrabold">Sharik Rasool (SEO Specialist)</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/60">
              {comparisonRows.map((row, idx) => (
                <div 
                  key={idx} 
                  className="grid grid-cols-1 md:grid-cols-12 transition-colors hover:bg-muted/30 text-xs sm:text-sm"
                >
                  {/* Feature Label */}
                  <div className="p-4 md:p-5 md:col-span-4 font-bold text-foreground flex items-center bg-muted/20 md:bg-transparent">
                    {row.feature}
                  </div>

                  {/* Agency Approach */}
                  <div className="p-4 md:p-5 md:col-span-4 border-t md:border-t-0 md:border-l border-border/60 text-muted-foreground flex items-start gap-2.5 bg-destructive/[0.02]">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="md:hidden text-[10px] font-extrabold uppercase tracking-wider text-destructive block mb-0.5">
                        Agency Reseller:
                      </span>
                      <span>{row.agency}</span>
                    </div>
                  </div>

                  {/* Specialist Approach */}
                  <div className="p-4 md:p-5 md:col-span-4 border-t md:border-t-0 md:border-l border-border/60 font-medium text-foreground flex items-start gap-2.5 bg-primary/[0.04]">
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="md:hidden text-[10px] font-extrabold uppercase tracking-wider text-primary block mb-0.5">
                        Sharik Rasool:
                      </span>
                      <span>{row.specialist}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Table Action Strip */}
            <div className="p-5 md:p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left text-xs sm:text-sm text-muted-foreground">
                <strong className="text-foreground">Looking for a transparent link building partner?</strong> Every campaign comes with 100% pre-approved placements.
              </div>
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link href="/projects" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-xs sm:text-sm font-semibold transition-colors">
                    View Case Studies
                  </button>
                </Link>
                <Link href="/seo-audit" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <span>Get $15 Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
