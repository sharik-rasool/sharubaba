"use client";

import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  Check,
  ShieldCheck,
  X,
  ArrowRight,
  Loader2,
  ExternalLink,
  Copy,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1LmzE6gmTJzksvlvwWsCGbqxu_RTEZL-afjAbx6KixRY/edit?gid=0#gid=0";

export function SampleSheetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "unlocked">("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user previously unlocked it
    const storedUnlocked = localStorage.getItem("sharik_sample_sheet_unlocked");
    if (storedUnlocked === "true") {
      setStatus("unlocked");
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-sample-sheet-modal", handleOpen);
    return () => window.removeEventListener("open-sample-sheet-modal", handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          website: website || "Not provided",
          subject: "Sample Sheet Access Unlocked: 50+ UK & SaaS Live Backlinks",
          message: `User unlocked the 50+ Backlink Sample Spreadsheet.\nName: ${name}\nEmail: ${email}\nWebsite: ${website || "N/A"}`,
        }),
      });
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      localStorage.setItem("sharik_sample_sheet_unlocked", "true");
      setStatus("unlocked");
      // Automatically open the sheet in a new tab for frictionless UX
      window.open(SAMPLE_SHEET_URL, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SAMPLE_SHEET_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "unlocked" ? (
          /* UNLOCKED STATE */
          <div className="text-center space-y-6 pt-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Access Unlocked
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                50+ Live Backlink Placements
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your spreadsheet access is ready. Browse unmasked DR50–85+ UK & SaaS publishers with verified traffic curves and live sample articles.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={SAMPLE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open Google Spreadsheet</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground font-medium text-xs border border-border/60 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copied to Clipboard!" : "Copy Spreadsheet Link"}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Direct Google Sheets view • 100% manual outreach samples
            </div>
          </div>
        ) : (
          /* GATED LEAD CAPTURE FORM */
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                Gated Sample Sheet
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Unlock 50+ Live Backlink Samples
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your details below to get instant access to our curated Google Sheet containing 50+ real UK & SaaS guest posts and editorial placements with live DR & organic traffic.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Your Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Work Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Website / Company <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. company.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl py-6 font-bold text-sm shadow-xl shadow-primary/20 gap-2 mt-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unlocking Spreadsheet...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Get Instant Access to Sample Sheet</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Zero spam • Instant view • Real verified publisher domains</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
