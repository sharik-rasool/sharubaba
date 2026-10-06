"use client";

import { useState } from "react";
import {
  Globe,
  Search,
  TrendingUp,
  Link2,
  ShieldCheck,
  Loader2,
  Sparkles,
  ArrowRight,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface Props {
  onSelectDomainForAudit?: (domain: string) => void;
}

export function SeoAuditPreviewWidget({ onSelectDomainForAudit }: Props) {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthorityData | null>(null);

  const handleQuickCheck = async () => {
    const domain = domainInput.trim();
    if (!domain) {
      setError("Please enter a domain to preview.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/domain-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to analyze domain. Please check spelling.");
        return;
      }

      setResult(json.data);
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAudit = () => {
    if (result && onSelectDomainForAudit) {
      onSelectDomainForAudit(result.domain);
    }
    const orderSection = document.getElementById("order-audit-section");
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Instant Live Preview
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-foreground">
          Check Your Current Domain Baseline for Free
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Enter your website to preview your public Ahrefs metrics before unlocking the full 15-point audit report.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuickCheck();
        }}
        className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-secondary/40 border border-border/80 focus-within:border-primary transition-all"
      >
        <div className="relative flex-1 flex items-center">
          <Globe className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
          <input
            type="text"
            placeholder="e.g. yourwebsite.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            className="w-full px-3 py-2.5 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl px-6 py-5 font-bold text-xs shadow-lg shadow-primary/20 gap-2 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Quick Scan
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="p-5 sm:p-6 rounded-2xl bg-secondary/30 border border-primary/30 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="text-xs text-muted-foreground font-semibold">Analyzed Domain</div>
              <div className="text-lg sm:text-xl font-black text-foreground flex items-center gap-1.5">
                <span>{result.domain}</span>
                <a
                  href={`https://${result.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{result.authorityTier}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <div className="text-[11px] text-muted-foreground uppercase font-bold">Domain Rating</div>
              <div className="text-2xl font-black text-foreground mt-0.5">{result.domainRating}</div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <div className="text-[11px] text-muted-foreground uppercase font-bold">Organic Traffic</div>
              <div className="text-2xl font-black text-foreground mt-0.5">{result.trafficFormatted}</div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <div className="text-[11px] text-muted-foreground uppercase font-bold">Ref. Domains</div>
              <div className="text-2xl font-black text-foreground mt-0.5">{result.referringDomains.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <div className="text-[11px] text-muted-foreground uppercase font-bold">Keywords</div>
              <div className="text-2xl font-black text-foreground mt-0.5">{result.organicKeywords.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-foreground">
                Want to see your missed competitor link gaps &amp; 90-day growth plan?
              </div>
              <div className="text-[11px] text-muted-foreground">
                Get the full custom PDF &amp; Excel report for {result.domain} delivered in 24–48h.
              </div>
            </div>
            <Button
              type="button"
              onClick={handleOrderAudit}
              className="w-full sm:w-auto rounded-xl px-5 py-2.5 font-bold text-xs shadow-lg shadow-primary/20 gap-2 shrink-0"
            >
              <span>Order Full $15 Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
