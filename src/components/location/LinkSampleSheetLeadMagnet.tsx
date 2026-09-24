"use client";

import { useState } from "react";
import { FileSpreadsheet, Download, Check, Shield, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

export function LinkSampleSheetLeadMagnet() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const sampleRows = [
    { domain: "b2b-***tech.co.uk", dr: 78, traffic: "142,000 /mo", niche: "UK Tech & Enterprise", type: "Contextual In-Content" },
    { domain: "saas-***growth.io", dr: 83, traffic: "310,000 /mo", niche: "Global SaaS & AI", type: "Guest Thought Leadership" },
    { domain: "london-***finance.com", dr: 74, traffic: "68,000 /mo", niche: "FinTech & Payments", type: "Editorial Resource Link" },
    { domain: "cloud-***cyber.org", dr: 86, traffic: "520,000 /mo", niche: "Cybersecurity & DevOps", type: "Expert Column Mention" },
    { domain: "uk-***retailtech.co.uk", dr: 71, traffic: "45,000 /mo", niche: "Ecommerce & Retail Tech", type: "In-Depth Guide Feature" },
  ];

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Lead Magnet - Sample Sheet",
          email: email,
          subject: "Sample Sheet Request: 50+ UK & SaaS Live Backlinks",
          message: `User requested the live 50+ backlink sample spreadsheet.\nName: ${name}\nEmail: ${email}`,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <section className="section bg-muted/15 border-y border-border/70" id="sample-sheet">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Copy & Form */}
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Free Lead Magnet
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Download Our 50+ Live UK & SaaS Backlink Sample Sheet
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                See the exact quality of sites we build links on. Browse 50+ real, unmasked editorial domains with verified Ahrefs DR, real organic traffic curves, and niche categorizations.
              </p>

              {status === "success" ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <Check className="w-5 h-5" />
                    Sample Sheet Sent!
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Check your inbox at <strong>{email}</strong> for the direct Google Sheets & CSV download link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDownload} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-card border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Work Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-card border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                        Sending Sample Sheet...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Live Sample Sheet (.CSV / Sheets)
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    Zero spam • Instant access • Real publisher metrics
                  </p>
                </form>
              )}
            </FadeIn>
          </div>

          {/* Right Column: Spreadsheet Mockup Preview */}
          <div className="lg:col-span-6">
            <FadeIn delay={0.2}>
              <div className="p-4 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-bold text-foreground ml-2">UK_SaaS_Live_Backlink_Samples_2026.xlsx</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    50+ Placements
                  </span>
                </div>

                {/* Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground font-bold">
                        <th className="pb-2">Domain Sample</th>
                        <th className="pb-2">Ahrefs DR</th>
                        <th className="pb-2">Organic Traffic</th>
                        <th className="pb-2">Niche</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {sampleRows.map((row, i) => (
                        <tr key={i} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-2.5 font-mono text-foreground">{row.domain}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded font-extrabold bg-primary/10 text-primary text-[11px]">
                              DR {row.dr}
                            </span>
                          </td>
                          <td className="py-2.5 text-foreground">{row.traffic}</td>
                          <td className="py-2.5 text-muted-foreground">{row.niche}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overlay Blur for Remaining 45+ Rows */}
                <div className="mt-3 pt-3 border-t border-border/60 text-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    + 45 more vetted UK & International publishers available in the full sheet
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
