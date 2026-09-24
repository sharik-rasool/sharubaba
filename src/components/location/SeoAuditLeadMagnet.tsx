"use client";

import { useState } from "react";
import { Search, Sparkles, ShieldCheck, Check, ArrowRight, Loader2, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

export function SeoAuditLeadMagnet() {
  const [formData, setFormData] = useState({ name: "", email: "", website: "", competitor: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.website) return;

    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || "Lead Magnet - SEO Audit",
          email: formData.email,
          subject: `Free UK SEO & Competitor Gap Audit: ${formData.website}`,
          message: `Website: ${formData.website}\nCompetitor: ${formData.competitor || "None provided"}\nName: ${formData.name}\nEmail: ${formData.email}`,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <section className="section bg-card/60 border-y border-border/80" id="seo-audit">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Search className="w-3.5 h-3.5" />
                Free Lead Magnet
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Claim Your Free 15-Point UK SEO & Competitor Gap Audit
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                Discover what’s holding your website back from Page 1 on Google.co.uk. I will personally review your technical crawlability, indexation status, and top 3 competitor keyword gaps.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Technical Crawl & Indexation Leak Detection</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Google.co.uk High-Intent Keyword Gap Analysis</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>Personalized Loom Video / PDF Action Plan</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.2}>
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-primary/30 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    Request Your Free Custom Audit
                  </h3>
                  <span className="text-[11px] font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    £500 Value • Free
                  </span>
                </div>

                {status === "success" ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">Audit Request Received!</h4>
                    <p className="text-xs text-muted-foreground">
                      I will run the diagnostics on <strong>{formData.website}</strong> and send your custom breakdown to <strong>{formData.email}</strong> within 24–48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Charlotte Davies"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Work Email</label>
                        <input
                          type="email"
                          required
                          placeholder="charlotte@brand.co.uk"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Website URL</label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourcompany.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Top UK Competitor (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., competitor.co.uk"
                        value={formData.competitor}
                        onChange={(e) => setFormData({ ...formData, competitor: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full rounded-xl py-6 font-bold text-sm shadow-lg shadow-primary/20 gap-2"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Audit Request...
                        </>
                      ) : (
                        <>
                          Get My Free SEO Diagnostic Plan
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      100% Free • No obligation • Manual expert audit
                    </p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
