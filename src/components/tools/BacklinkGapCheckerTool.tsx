"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Search,
  Key,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  Sparkles,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  Layers,
  FileSpreadsheet,
  HelpCircle,
  Lock,
  Unlock,
  Check,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";

export interface RefPageResult {
  urlFrom: string;
  titleFrom: string;
  domain: string;
  domainRating: number;
  urlRating?: number;
  trafficDomain: number;
  trafficPage?: number;
  isDofollow: boolean;
  intersectCount: number;
  competitorsLinked: string[];
}

interface UserQuota {
  name: string;
  daysRemaining: number;
  searchesRemaining: number;
  dailyLimit: number;
}

interface GapApiResponse {
  success: boolean;
  cached?: boolean;
  targetDomain: string;
  competitorDomains: string[];
  results: RefPageResult[];
  totalResults: number;
  user: UserQuota;
}

const SAMPLE_PRESETS = [
  {
    label: "Fintech / Payments",
    target: "stripe.com",
    comps: ["paddle.com", "square.com"],
  },
  {
    label: "Productivity SaaS",
    target: "notion.so",
    comps: ["coda.io", "evernote.com"],
  },
  {
    label: "SEO Software",
    target: "ahrefs.com",
    comps: ["semrush.com", "moz.com"],
  },
];

export function BacklinkGapCheckerTool() {
  // Key verification & storage
  const [accessKey, setAccessKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifyingKey, setVerifyingKey] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [userQuota, setUserQuota] = useState<UserQuota | null>(null);
  const [authTab, setAuthTab] = useState<"unlock" | "buy">("unlock");

  // Buy form state
  const [buyName, setBuyName] = useState("");
  const [buyEmail, setBuyEmail] = useState("");
  const [buyWebsite, setBuyWebsite] = useState("");
  const [requestingKey, setRequestingKey] = useState(false);
  const [buySuccessMessage, setBuySuccessMessage] = useState<string | null>(null);

  // Analysis form state
  const [targetDomain, setTargetDomain] = useState("");
  const [competitors, setCompetitors] = useState<string[]>(["", ""]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<GapApiResponse | null>(null);
  const [tableSearch, setTableSearch] = useState("");

  // Load key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("sharus_backlink_gap_key");
    if (savedKey) {
      setAccessKey(savedKey);
      verifyKey(savedKey, true);
    }
  }, []);

  const verifyKey = async (keyToVerify: string, isSilent: boolean = false) => {
    if (!keyToVerify.trim()) {
      if (!isSilent) setKeyError("Please enter your access key.");
      return;
    }

    setVerifyingKey(true);
    setKeyError(null);

    try {
      const res = await fetch("/api/tools/backlink-gap/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyToVerify.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setKeyError(data.error || "Invalid or expired access key.");
        setIsUnlocked(false);
        if (!isSilent) localStorage.removeItem("sharus_backlink_gap_key");
        return;
      }

      setIsUnlocked(true);
      setUserQuota({
        name: data.name,
        daysRemaining: data.daysRemaining,
        searchesRemaining: data.searchesRemaining,
        dailyLimit: data.dailyLimit,
      });
      localStorage.setItem("sharus_backlink_gap_key", data.key);
    } catch {
      if (!isSilent) setKeyError("Network error verifying your key. Please try again.");
    } finally {
      setVerifyingKey(false);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyKey(accessKey);
  };

  const handleRequestKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyName.trim() || !buyEmail.trim()) return;

    setRequestingKey(true);
    setBuySuccessMessage(null);

    try {
      const res = await fetch("/api/tools/backlink-gap/request-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buyName,
          email: buyEmail,
          website: buyWebsite,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBuySuccessMessage(
          `Thank you, ${buyName.trim()}! Your request for a 3-Month Pro Pass ($10) has been received. Our team will send your invoice/payment link and personalized access key directly to ${buyEmail} shortly.`
        );
      }
    } catch {
      alert("Failed submitting request. Please try again.");
    } finally {
      setRequestingKey(false);
    }
  };

  const handleAddCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, ""]);
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    if (competitors.length > 1) {
      const updated = competitors.filter((_, i) => i !== index);
      setCompetitors(updated);
    }
  };

  const handleCompetitorChange = (index: number, val: string) => {
    const updated = [...competitors];
    updated[index] = val;
    setCompetitors(updated);
  };

  const handleRunAnalysis = async (forceRefresh: boolean = false) => {
    if (!targetDomain.trim()) {
      setAnalysisError("Please enter your website domain.");
      return;
    }

    const validComps = competitors.map((c) => c.trim()).filter((c) => c.length > 2);
    if (validComps.length === 0) {
      setAnalysisError("Please enter at least one competitor website domain.");
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch("/api/tools/backlink-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: accessKey,
          targetDomain,
          competitorDomains: validComps,
          refresh: forceRefresh,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setAnalysisError(json.error || "Failed to analyze competitor backlink gaps.");
        return;
      }

      setResultData(json);
      if (json.user) {
        setUserQuota(json.user);
      }
    } catch {
      setAnalysisError("Network connection error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!resultData || resultData.results.length === 0) return;

    const headers = [
      "Referring Page Title",
      "Source URL (url_from)",
      "Domain",
      "Domain Rating (DR)",
      "Monthly Traffic",
      "Link Type",
      "Competitors Featured",
    ];

    const rows = resultData.results.map((r) => [
      `"${(r.titleFrom || "").replace(/"/g, '""')}"`,
      `"${r.urlFrom}"`,
      `"${r.domain}"`,
      r.domainRating,
      r.trafficDomain,
      r.isDofollow ? "Dofollow" : "Nofollow",
      `"${r.competitorsLinked.join(", ")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `backlink-gap-${resultData.targetDomain}-vs-competitors.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = (resultData?.results || []).filter((r) => {
    if (!tableSearch.trim()) return true;
    const query = tableSearch.toLowerCase();
    return (
      r.titleFrom.toLowerCase().includes(query) ||
      r.domain.toLowerCase().includes(query) ||
      r.urlFrom.toLowerCase().includes(query)
    );
  });

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Ahrefs-Powered Link Intersect
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
          Competitor Backlink <br />
          <span className="text-primary">Gap &amp; Outreach Finder</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Uncover the exact high-DR listicles, roundups, and guest posts linking to your competitors{" "}
          <strong className="text-foreground">that do not link to you</strong>. Filtered strictly to{" "}
          <strong>DR 50–80</strong> for maximum outreach conversion.
        </p>
      </section>

      {/* ACCESS KEY GATING CARD (IF NOT UNLOCKED) */}
      {!isUnlocked ? (
        <FadeIn>
          <div className="max-w-xl mx-auto rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden">
            {/* 2-Tab Switcher Header */}
            <div className="grid grid-cols-2 border-b border-border/80 bg-secondary/30">
              <button
                type="button"
                onClick={() => setAuthTab("unlock")}
                className={`py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  authTab === "unlock"
                    ? "border-primary text-primary bg-card/60"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Key className="w-4 h-4" />
                <span>I Have a Key</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("buy")}
                className={`py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  authTab === "buy"
                    ? "border-primary text-primary bg-card/60"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Get 3-Month Pass ($10)</span>
              </button>
            </div>

            {/* TAB 1: I HAVE A KEY */}
            {authTab === "unlock" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-bold text-foreground">
                    Enter Your Access Key
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your personalized license key to unlock unlimited competitor gap scans for 90 days.
                  </p>
                </div>

                <form onSubmit={handleKeySubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      License Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GAP-XXXX-XXXX"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/80 text-foreground font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                    />
                  </div>

                  {keyError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{keyError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={verifyingKey}
                    className="w-full rounded-xl py-6 font-bold text-sm gap-2 shadow-lg shadow-primary/20"
                  >
                    {verifyingKey ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating Key...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        Unlock 3-Month Pro Pass
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* TAB 2: BUY A KEY ($10) */}
            {authTab === "buy" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    Special Offer • $10 Flat for 3 Months
                  </div>
                  <h3 className="text-xl font-black text-foreground">
                    Get Your 3-Month Pro Pass
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Direct access to live Ahrefs competitive link intersect data with zero bot spam.
                  </p>
                </div>

                {/* Value Checklist */}
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exact linking article URLs &amp; listicle page titles</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Filtered strictly to DR 50–80 (the outreach sweet spot)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>20 fresh scans per day (1,800 scans across 90 days)</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Click CSV export ready for cold outreach</span>
                  </div>
                </div>

                {buySuccessMessage ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium space-y-3">
                    <p>{buySuccessMessage}</p>
                    <Button
                      type="button"
                      onClick={() => setAuthTab("unlock")}
                      className="w-full rounded-xl font-bold text-xs"
                    >
                      Go to Activation &rarr;
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRequestKey} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={buyName}
                        onChange={(e) => setBuyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/80 text-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={buyEmail}
                        onChange={(e) => setBuyEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/80 text-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Website (Optional)</label>
                      <input
                        type="text"
                        placeholder="yourdomain.com"
                        value={buyWebsite}
                        onChange={(e) => setBuyWebsite(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border/80 text-foreground text-xs focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={requestingKey}
                      className="w-full rounded-xl py-6 font-bold text-sm shadow-lg shadow-primary/20 gap-2"
                    >
                      {requestingKey ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Reserving Key...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Request $10 Pro Pass (3 Months)
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      ) : (
        /* UNLOCKED: MAIN TOOL INTERFACE */
        <FadeIn>
          <div className="max-w-4xl mx-auto space-y-10">
            {/* VIP Status Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:px-6 rounded-2xl bg-secondary/40 border border-primary/30 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-foreground">
                  Pro Pass Active: Welcome, {userQuota?.name || "Member"}!
                </span>
                <span className="text-muted-foreground hidden md:inline">
                  • {userQuota?.daysRemaining ?? 90} days left
                </span>
                <span className="text-muted-foreground">
                  • <strong className="text-foreground">{userQuota?.searchesRemaining ?? 20}</strong>/20 searches left today
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("sharus_backlink_gap_key");
                  setIsUnlocked(false);
                  setResultData(null);
                  setAccessKey("");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 border border-border/60 hover:border-rose-500/30 text-xs font-semibold transition-all shrink-0"
                title="Log out and remove key from this browser"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* DOMAIN & COMPETITORS INPUT CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-6">
              <div className="space-y-1 border-b border-border/60 pb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                  Run Competitor Backlink Gap Analysis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Find pages that link to your competitors in the DR 50–80 authority range.
                </p>
              </div>

              <div className="space-y-4">
                {/* Your Domain */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span>Your Website</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. yourdomain.com"
                    value={targetDomain}
                    onChange={(e) => setTargetDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Competitors */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Competitor Domains (1 to 3)
                    </label>
                    {competitors.length < 3 && (
                      <button
                        type="button"
                        onClick={handleAddCompetitor}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Competitor</span>
                      </button>
                    )}
                  </div>

                  {competitors.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={`Competitor #${idx + 1} (e.g. competitor${idx + 1}.com)`}
                          value={comp}
                          onChange={(e) => handleCompetitorChange(idx, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      {competitors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetitor(idx)}
                          className="p-3 rounded-xl bg-secondary/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 border border-border/60 transition-colors"
                          title="Remove competitor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Sample Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Try sample presets:</span>
                  {SAMPLE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setTargetDomain(p.target);
                        setCompetitors(p.comps);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-primary/40 text-foreground transition-all duration-200"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {analysisError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                    {analysisError}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => handleRunAnalysis()}
                    disabled={analyzing}
                    className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning Live Ahrefs Refpages...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Find Competitor Backlink Gaps
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* RESULTS DASHBOARD */}
            {resultData && (
              <FadeIn>
                <div className="rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 space-y-8">
                  {/* Result Header & CSV Download */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Backlink Gap Analysis
                        </span>
                        {resultData.cached && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                            ⚡ 15-Day Cache (0 API Units)
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-foreground">
                        {resultData.totalResults} High-DR Prospects Discovered
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Websites linking to {resultData.competitorDomains.join(", ")} that don&apos;t link to{" "}
                        <strong className="text-foreground">{resultData.targetDomain}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunAnalysis(true)}
                        disabled={analyzing}
                        className="rounded-xl text-xs font-bold gap-1.5 border-border/80"
                        title="Bypass cache and refresh live from Ahrefs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? "animate-spin" : ""}`} />
                        Refresh Live
                      </Button>

                      <Button
                        type="button"
                        onClick={handleDownloadCSV}
                        className="rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-primary/20"
                      >
                        <Download className="w-4 h-4" />
                        Export to CSV
                      </Button>
                    </div>
                  </div>

                  {/* 4 Summary Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Total Prospects
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-foreground">
                        {resultData.totalResults}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        DR 50–80 editorial pages
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        High-Overlap Targets
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400">
                        {resultData.results.filter((r) => r.intersectCount > 1).length}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Link to 2+ competitors
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Avg Domain Rating
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-primary">
                        {Math.round(
                          resultData.results.reduce((acc, r) => acc + r.domainRating, 0) /
                            (resultData.results.length || 1)
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Outreach sweet spot
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Combined Reach
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-foreground">
                        {formatNumber(
                          resultData.results.reduce((acc, r) => acc + r.trafficDomain, 0)
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Monthly search visits
                      </div>
                    </div>
                  </div>

                  {/* DATA TABLE WITH INLINE SEARCH */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter by title, domain, or keyword..."
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/40 border border-border/60 text-xs text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium self-end sm:self-auto">
                        Showing {filteredResults.length} of {resultData.totalResults} prospects
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider text-[10px] border-b border-border/60">
                          <tr>
                            <th className="py-3 px-4">Source Page &amp; Article</th>
                            <th className="py-3 px-4">Referring Domain</th>
                            <th className="py-3 px-4 text-center">DR</th>
                            <th className="py-3 px-4">Monthly Traffic</th>
                            <th className="py-3 px-4">Competitors Linked</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {filteredResults.map((item, idx) => (
                            <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                              {/* Page Title & URL */}
                              <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                                <div className="space-y-1">
                                  <a
                                    href={item.urlFrom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                                  >
                                    <span className="truncate">{item.titleFrom || item.urlFrom}</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                  <div className="text-[11px] text-muted-foreground font-mono truncate">
                                    {item.urlFrom}
                                  </div>
                                </div>
                              </td>

                              {/* Domain */}
                              <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>{item.domain}</span>
                                </div>
                              </td>

                              {/* DR Badge */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs">
                                  DR {item.domainRating}
                                </span>
                              </td>

                              {/* Traffic */}
                              <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                                <div className="flex items-center gap-1 font-semibold text-foreground">
                                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{formatNumber(item.trafficDomain)} /mo</span>
                                </div>
                              </td>

                              {/* Competitors Linked */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {item.competitorsLinked.map((comp) => (
                                    <span
                                      key={comp}
                                      className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold text-foreground border border-border/60"
                                    >
                                      {comp}
                                    </span>
                                  ))}
                                  {item.intersectCount > 1 && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black">
                                      ★ {item.intersectCount}x Overlap
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Manual Outreach Pitch Card */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-card border border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Turn Gaps Into Placements
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-foreground">
                        Want Us to Pitch &amp; Win These Exact Links for You?
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        I specialize in 100% white-hat manual editorial outreach. We pitch your SaaS directly to the authors and editors of these exact DR 50–80 pages.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
                      <a
                        href="https://calendly.com/sharikkashmiri"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all text-center"
                      >
                        <span>Book Strategy Call</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      )}

      {/* COMPREHENSIVE EDUCATIONAL GUIDE */}
      <section className="max-w-4xl mx-auto space-y-12 pt-8 border-t border-border/60">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Strategic Link Building
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            What is a Competitor Backlink Gap?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A <strong>Backlink Gap</strong> represents the high-value websites, listicles, and editorial blogs that currently link to your primary competitors, but have zero backlinks pointing to your domain. Instead of guessing which publications might be open to covering your product, a competitor backlink gap scan gives you an exact roadmap of proven, warm outreach prospects.
          </p>
        </div>

        {/* WHY DR 50-80 IS THE GOLDEN SWEET SPOT */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Why We Filter Strictly to DR 50–80
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                DR 50–80 (Target Zone)
              </span>
              <h4 className="font-bold text-foreground text-sm">High Authority &amp; Reachable Editors</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Authority tech blogs, industry magazines, and review roundups. They possess strong Google search trust, yet have accessible editorial teams who actively reply to well-crafted pitches and founder contributions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                DR 80+ &amp; Sub-50 (Excluded)
              </span>
              <h4 className="font-bold text-foreground text-sm">Unreachable Giants or Weak Sites</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Domains like Wikipedia, Apple, and Forbes are nearly impossible to pitch cold. Meanwhile, domains below DR 50 often pass negligible link equity. We strip out both extremes to save you weeks of wasted outreach.
              </p>
            </div>
          </div>
        </div>

        {/* 3-STEP OUTREACH BLUEPRINT */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            3-Step Framework to Replicate Competitor Backlinks
          </h3>
          <div className="space-y-3.5 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-foreground">Identify the Article Angle:</strong> Check the source URL. If the page is a &quot;Best 10 Tools&quot; listicle featuring your competitor, pitch your product as a worthy alternative to be included in their next update.
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-foreground">Prioritize Multi-Competitor Intersects:</strong> If an editorial article links to 2 or 3 of your competitors simultaneously, the author writes extensively about your exact category. They are 5x more likely to cover you.
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-foreground">Export CSV &amp; Personalize Outreach:</strong> Use the 1-click CSV download to import prospects directly into your outreach software (Instantly, Lemlist) and reference the specific article title in your email hook.
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="faq-keys" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                Why does this tool require an Access Key?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                This tool runs live, heavy competitor intersect queries against Ahrefs API v3. To prevent bot abuse, conserve server resources, and ensure 100% uptime for paying members, access is limited to verified 3-month key holders.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-limit" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How does the 20 searches/day limit work?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                Each access key includes up to 20 fresh competitive gap scans every 24 hours (totaling up to 1,800 scans across your 90-day pass). The quota resets automatically at midnight.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-spam" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How are spam and low-quality links filtered out?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                We strictly filter by Dofollow links, exclude zero-traffic domains, and isolate root editorial sources between DR 50 and DR 80. This guarantees you don&apos;t waste hours sifting through scraper spam, automated blogrolls, or dead PBNs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
