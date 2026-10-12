"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Globe,
  Search,
  TrendingUp,
  Link2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Calendar,
  Table,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";

export interface CountryTrafficData {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  traffic: number;
  trafficFormatted: string;
  percentage: number;
  keywords: number;
}

export interface TrafficHistoryPoint {
  date: string;
  label: string;
  traffic: number;
  keywords?: number;
}

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
  source: 'live' | 'simulation';
  topCountries?: CountryTrafficData[];
  trafficHistory?: TrafficHistoryPoint[];
  analyzedAt: string;
  cached?: boolean;
  cacheExpiresInDays?: number;
}

const SAMPLE_DOMAINS = [
  "stripe.com",
  "notion.so",
  "linear.app",
  "ahrefs.com",
  "sharikrasool.com",
];

export function WebsiteAuthorityCheckerTool() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuthorityData | null>(null);
  const [graphView, setGraphView] = useState<"chart" | "table">("chart");

  const handleAnalyze = async (targetDomain?: string, forceRefresh: boolean = false) => {
    const domainToTest = (targetDomain || domainInput).trim();
    if (!domainToTest) {
      setError("Please enter a domain or URL to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/domain-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainToTest, refresh: forceRefresh }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to analyze domain. Please check the spelling and try again.");
        return;
      }

      setResult(json.data);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSampleSheet = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-sample-sheet-modal"));
    }
  };

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const currentDr = result ? result.domainRating : 0;
  const strokeDashoffset = circumference - (currentDr / 100) * circumference;

  const getDrColor = (dr: number) => {
    if (dr >= 80) return "text-emerald-400 stroke-emerald-500";
    if (dr >= 60) return "text-primary stroke-primary";
    if (dr >= 40) return "text-amber-400 stroke-amber-400";
    if (dr >= 20) return "text-orange-400 stroke-orange-400";
    return "text-rose-400 stroke-rose-400";
  };

  // 6-Month Traffic History helpers & metrics
  const history = result?.trafficHistory || [];
  const firstPointTraffic = history.length > 0 ? history[0].traffic : 0;
  const latestTraffic = history.length > 0 ? history[history.length - 1].traffic : (result?.organicTraffic ?? 0);
  const latestLabel = history.length > 0 ? history[history.length - 1].label : "Current";
  const netChangePct = firstPointTraffic > 0 ? ((latestTraffic - firstPointTraffic) / firstPointTraffic) * 100 : 0;
  const isPositiveGrowth = netChangePct >= 0;
  const peakPoint = history.length > 0
    ? history.reduce((max, p) => (p.traffic > max.traffic ? p : max), history[0])
    : { traffic: latestTraffic, label: latestLabel };
  const totalTrafficSum = history.reduce((sum, p) => sum + p.traffic, 0);
  const avgMonthlyTraffic = history.length > 0 ? Math.round(totalTrafficSum / history.length) : latestTraffic;

  const formatYAxis = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(val % 1_000 === 0 ? 0 : 1)}K`;
    return String(val);
  };

  interface TooltipPayloadItem {
    payload: TrafficHistoryPoint;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const currentVal = dataPoint.traffic;
      return (
        <div className="rounded-xl bg-card/95 backdrop-blur-md border border-border/80 shadow-2xl p-3.5 space-y-1.5 text-xs min-w-[200px]">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5 text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {dataPoint.label}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary">Google Organic</span>
          </div>
          <div className="pt-0.5">
            <div className="text-[11px] text-muted-foreground">Estimated Search Visits</div>
            <div className="text-base font-black text-foreground">
              {currentVal.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">/mo</span>
            </div>
          </div>
          {dataPoint.keywords ? (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
              <span>Keywords in Top 100:</span>
              <span className="font-bold text-foreground">{dataPoint.keywords.toLocaleString()}</span>
            </div>
          ) : null}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Ahrefs-Powered SEO Tool
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
          Website Authority &amp; <br />
          <span className="text-primary">Organic Traffic Checker</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Instantly check any website&apos;s <strong>Domain Rating (DR)</strong>, estimated monthly organic search traffic, and backlink authority. Uncover ranking power and growth gaps in seconds.
        </p>

        {/* DOMAIN INPUT BAR */}
        <div className="max-w-xl mx-auto pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-card border border-border/80 shadow-2xl focus-within:border-primary transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Globe className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Enter domain (e.g. stripe.com or yoursite.com)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full px-3 py-3 bg-transparent text-sm sm:text-base text-foreground focus:outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-7 py-6 font-bold text-sm shadow-lg shadow-primary/20 gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Authority
                </>
              )}
            </Button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <span className="font-semibold">Try examples:</span>
            {SAMPLE_DOMAINS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setDomainInput(sample);
                  handleAnalyze(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-primary/40 text-foreground transition-all duration-200"
              >
                {sample}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS DASHBOARD */}
      {result && (
        <FadeIn>
          <div className="max-w-5xl mx-auto rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-10 space-y-10 relative overflow-hidden">
            {/* Top Bar: Target Domain & Source */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Domain Overview
                  </span>
                  {result.cached && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      ⚡ 15-Day Cache ({result.cacheExpiresInDays ?? 15}d left)
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
                  <span>{result.domain}</span>
                  <a
                    href={`https://${result.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyze(result.domain, true)}
                  disabled={loading}
                  className="rounded-xl text-xs font-semibold gap-1.5 border-border/80 hover:border-primary/50"
                  title="Bypass cache and re-check latest live metrics from Ahrefs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh Live
                </Button>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{result.authorityTier}</span>
                </div>
              </div>
            </div>

            {/* Main Stats Grid with Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Circular DR Gauge (Left Column) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-secondary/30 border border-border/60 text-center relative">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                    {/* Background Track */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className="stroke-muted/40"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      className={`${getDrColor(result.domainRating)} transition-all duration-1000 ease-out`}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-foreground tracking-tight">
                      {result.domainRating}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      Domain Rating
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-xs font-bold text-foreground">
                    Scale: 0 (Low) to 100 (Elite)
                  </div>
                  {result.ahrefsRank && (
                    <div className="text-[11px] text-muted-foreground">
                      Ahrefs Rank: <strong className="text-foreground">#{result.ahrefsRank.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Metric Cards (Right Column) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traffic */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Organic Traffic
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.trafficFormatted}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Estimated monthly search visits from Google
                  </div>
                </div>

                {/* Referring Domains */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Referring Domains
                    </span>
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.referringDomains.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Unique websites linking to this domain
                  </div>
                </div>

                {/* Total Backlinks */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Total Backlinks
                    </span>
                    <Link2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.backlinks.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Cumulative live editorial and in-content links
                  </div>
                </div>

                {/* Ranked Keywords */}
                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/60 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Organic Keywords
                    </span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.organicKeywords.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Keywords ranking in Google top 100 search results
                  </div>
                </div>
              </div>
            </div>

            {/* 6-Month Organic Traffic Trend Section */}
            {result.trafficHistory && result.trafficHistory.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-secondary/20 border border-border/80 space-y-6 shadow-inner">
                {/* Header with Title, Trajectory Badge, and View Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
                        6-Month Organic Traffic Trend
                      </h3>
                      <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Google Search Visibility
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Historical monthly search traffic trajectory and ranking velocity for <strong className="text-foreground">{result.domain}</strong>
                    </p>
                  </div>

                  {/* View Switcher: Chart vs Table */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setGraphView("chart")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        graphView === "chart"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Trend Graph
                    </button>
                    <button
                      type="button"
                      onClick={() => setGraphView("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        graphView === "table"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      Data Table
                    </button>
                  </div>
                </div>

                {/* 4 Detailing KPI Metric Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* 1. Latest Traffic */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Current Monthly Visits
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-foreground">
                      {latestTraffic.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Latest reported month ({latestLabel})
                    </div>
                  </div>

                  {/* 2. 6-Month Trajectory Net % */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      6-Month Velocity
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg sm:text-2xl font-black ${isPositiveGrowth ? "text-emerald-400" : "text-rose-400"}`}>
                        {isPositiveGrowth ? "+" : ""}{netChangePct.toFixed(1)}%
                      </span>
                      {isPositiveGrowth ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {isPositiveGrowth ? "Upward search momentum" : "Traffic contraction phase"}
                    </div>
                  </div>

                  {/* 3. Peak Month */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      6-Month Peak
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-foreground">
                      {peakPoint.traffic.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Highest volume ({peakPoint.label})
                    </div>
                  </div>

                  {/* 4. 6-Month Monthly Average */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Monthly Average
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-foreground">
                      {avgMonthlyTraffic.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Baseline 6-month mean visits
                    </div>
                  </div>
                </div>

                {/* Dynamic View: Chart vs Table */}
                {graphView === "chart" ? (
                  <div className="pt-2">
                    <div className="h-[280px] sm:h-[340px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={result.trafficHistory}
                          margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                          <XAxis
                            dataKey="label"
                            stroke="currentColor"
                            className="text-muted-foreground text-[11px] font-semibold"
                            tickLine={false}
                            axisLine={false}
                            dy={8}
                          />
                          <YAxis
                            stroke="currentColor"
                            className="text-muted-foreground text-[10px] font-medium"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatYAxis}
                            dx={-4}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="traffic"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#trafficGradient)"
                            activeDot={{ r: 6, className: "fill-emerald-400 stroke-card stroke-2" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground border-t border-border/40 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span>Organic visits estimated from Google search results across indexed keywords</span>
                      </div>
                      <div className="font-semibold text-foreground">
                        Source: Live Ahrefs Metrics
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider text-[10px] border-b border-border/60">
                        <tr>
                          <th className="py-3 px-4">Period</th>
                          <th className="py-3 px-4">Est. Monthly Visits</th>
                          <th className="py-3 px-4">MoM Change</th>
                          <th className="py-3 px-4">Keywords in Top 100</th>
                          <th className="py-3 px-4">Search Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {result.trafficHistory.map((pt, idx) => {
                          const prev = idx > 0 ? result.trafficHistory![idx - 1].traffic : null;
                          const delta = prev && prev > 0 ? ((pt.traffic - prev) / prev) * 100 : null;
                          return (
                            <tr key={pt.date || idx} className="hover:bg-secondary/20 transition-colors">
                              <td className="py-3 px-4 font-bold text-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                  {pt.label}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-black text-foreground">
                                {pt.traffic.toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                {delta !== null ? (
                                  <span className={`inline-flex items-center gap-1 font-bold ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Baseline</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground font-semibold">
                                {pt.keywords ? pt.keywords.toLocaleString() : "—"}
                              </td>
                              <td className="py-3 px-4">
                                {delta === null ? (
                                  <span className="text-muted-foreground">Initial Scan</span>
                                ) : delta >= 5 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                    Gaining Search Share
                                  </span>
                                ) : delta <= -5 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                                    Traffic Softening
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold">
                                    Stable Volume
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Top 5 Countries Breakdown */}
            {result.topCountries && result.topCountries.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-secondary/20 border border-border/60 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">
                      Top 5 Countries by Organic Traffic
                    </h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Geographic organic traffic &amp; keyword distribution
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {result.topCountries.map((country, idx) => (
                    <div
                      key={country.countryCode || idx}
                      className="p-3.5 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-lg shrink-0">{country.flagEmoji}</span>
                          <span className="text-xs font-bold text-foreground truncate" title={country.countryName}>
                            {country.countryName}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                          {country.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, country.percentage))}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span className="font-bold text-foreground">{country.trafficFormatted}</span>
                        <span>{country.keywords.toLocaleString()} kw</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Analysis & Growth Recommendation */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-muted/40 to-muted/20 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>SEO Authority Verdict &amp; Strategic Roadmap</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                <strong>Current Status:</strong> {result.verdict}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Next Link Building Step:</strong> {result.recommendation}
              </p>
            </div>

            {/* $15 SEO Audit Feature Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-card border border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Productized Audit Service • $15 Flat
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-foreground">
                  Want the Full Executive Backlink &amp; Competitor Gap Audit?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get an in-depth custom PDF deck + interactive Excel action sheet with your competitor link gaps, toxic backlinks, and a 90-day fix roadmap for <strong>{result.domain}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
                <Link
                  href="/seo-audit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-98 text-center"
                >
                  <FileText className="w-4 h-4" />
                  <span>Get $15 Custom Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Conversion CTA Block */}
            <div className="p-8 rounded-3xl bg-card border border-border/80 text-center space-y-6">
              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Want to Increase Your Domain Rating to 70+?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  I help SaaS and tech companies acquire high-DR contextual backlinks through 100% white-hat manual outreach.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenSampleSheet}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-98"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>View 10+ Live Backlink Sample Sheet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://calendly.com/sharikkashmiri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs border border-border/60 transition-colors"
                >
                  <span>Book Free Strategy Call</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* COMPREHENSIVE SEO CONTENT GUIDE */}
      <section className="max-w-4xl mx-auto space-y-16 pt-8 border-t border-border/60">
        {/* SECTION 1: WHAT IS DR */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authority Metrics
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            What is Ahrefs Domain Rating (DR)?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            <strong>Domain Rating (DR)</strong> is a proprietary SEO metric developed by Ahrefs that measures the strength and quality of a website’s overall backlink profile on a logarithmic scale from <strong>0 to 100</strong>. Unlike raw backlink counts, DR focuses heavily on the <em>equity and authority</em> of unique referring websites pointing to your domain.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Because the scale is logarithmic, advancing from DR 70 to DR 80 requires significantly more high-tier, authoritative referring domains than climbing from DR 20 to DR 30. A website with high Domain Rating commands substantial search engine trust, enabling newly published content to index and rank on Google&apos;s first page far faster than newer or lower-authority domains.
          </p>
        </div>

        {/* SECTION 2: 6-MONTH ORGANIC TRAFFIC TREND */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Search Trajectory
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            How to Read the 6-Month Organic Traffic Trend Graph
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Static authority metrics like Domain Rating tell you how many websites have linked to a domain historically. However, the <strong>6-Month Organic Traffic Trend</strong> tells you how Google views the website <em>right now</em>. When evaluating competitor growth or vetting link building partners, the trendline is your ultimate sanity check.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  Upward Curve
                </span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Expanding Topical Velocity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The domain is gaining rankings across new keyword clusters. Search engines are allocating increased crawl budget. Backlinks placed on domains with upward velocity compound in equity over time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  Stable Plateau
                </span>
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Resilient Category Leader</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consistent monthly search volume holding steady across recent Google Core updates. Indicates deep domain moats and protected commercial search rankings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                  Steep Cliff
                </span>
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Algorithmic Softening</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A sudden 35%+ drop in traffic over 60–90 days typically signals a Google Helpful Content or Spam demotion. Even if DR remains high temporarily, the link equity passed is often heavily discounted.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: REFERRING DOMAINS VS BACKLINKS EQUITY RATIO */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5" />
            Link Quality Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Referring Domains vs. Total Backlinks: The Equity Ratio
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            One of the most common traps in SEO is conflating total backlink volume with real search authority. Search engine algorithms calculate PageRank based on <strong>unique root domains and distinct C-class IP subnets</strong>, not duplicate links from the same host.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Healthy Equity Ratio (1:2 to 1:15)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A website with <strong>1,200 referring domains</strong> and <strong>8,000 backlinks</strong> demonstrates natural organic acquisition. Most domains link 1 to 5 times contextually within editorial content, guest posts, and resource guides.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Spam / Sitewide Flag (&gt; 1:50 Ratio)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If a domain shows <strong>40 referring domains</strong> but <strong>250,000 backlinks</strong>, it almost certainly indicates sitewide footer links, scraper syndication, or widget spam. Google filters these out, meaning real ranking impact is negligible.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: ORGANIC KEYWORDS & GEOGRAPHIC TRAFFIC */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            Market &amp; Intent Alignment
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Keywords Footprint &amp; Geographic Distribution
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our tool analyzes both the <strong>total keywords ranking in Google&apos;s top 100</strong> and the <strong>top 5 countries</strong> driving organic search visits. Here is why both metrics are critical:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Top 100 Keywords Breadth
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A domain ranking for 10,000+ organic terms indicates comprehensive topical clustering. Broad keyword visibility protects domains from single-keyword ranking volatility during seasonal shifts or algorithmic updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Geographic Traffic Alignment
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Not all traffic carries equal commercial intent. For B2B SaaS and high-ticket services, a backlink from a domain with 65% US/UK traffic delivers significantly higher referral value and local algorithmic authority than untargeted global traffic.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: DR TIERS BREAKDOWN */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Understanding Domain Rating Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  DR 80–100
                </span>
                <span className="text-xs text-muted-foreground font-bold">Elite Enterprise</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">Industry Giants &amp; Category Leaders</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Domains like Stripe, GitHub, Notion, and HubSpot. They can publish a new piece of content and rank on Page 1 within hours due to massive historical backlink trust.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  DR 60–79
                </span>
                <span className="text-xs text-muted-foreground font-bold">Established Brands</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">High-Authority Scale-Ups &amp; SaaS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Competitive market leaders with solid link foundations capable of winning mid-to-high competition commercial keyword SERPs against established incumbents.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                  DR 40–59
                </span>
                <span className="text-xs text-muted-foreground font-bold">Mid-Market SaaS</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">Growing Product Companies</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solid organic traction. Needs consistent monthly manual outreach to break into the DR60+ bracket and capture enterprise search volume.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                  DR 0–39
                </span>
                <span className="text-xs text-muted-foreground font-bold">Early Stage</span>
              </div>
              <h3 className="font-bold text-foreground text-sm">New Websites &amp; Bootstrapped Ventures</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Minimal backlink equity. Requires a focused 3–6 month link building sprint to acquire foundational DR50+ guest posts, partner mentions, and resource citations.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 6: 4-STEP VETTING FRAMEWORK */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Practical Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            4-Step Framework for Vetting Backlink Prospects
          </h2>
          <div className="space-y-3.5 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-foreground">Check Domain Rating Floor (DR 40+):</strong> Ensure the prospective site has cleared early-stage link penalties and established genuine root domain trust with Google.
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-foreground">Confirm 6-Month Traffic Trendline:</strong> Verify the traffic line is either flat or ascending. Reject prospects showing sharp downward cliffs that suggest recent algorithmic demotions.
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-foreground">Validate Referring Domain to Backlink Ratio:</strong> Confirm the ratio sits below 1:20. Avoid domains with disproportionate backlink counts that indicate automated footer or blogroll spam.
              </div>
            </div>

            <div className="flex gap-3.5 items-start p-4 rounded-xl bg-card border border-border/60">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <strong className="text-foreground">Verify Geographic Alignment:</strong> Inspect the top 5 countries to confirm the audience mirrors your product&apos;s primary commercial target market (e.g. US, UK, Canada).
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: 5 STRATEGIES TO INCREASE DR */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            5 Proven Strategies to Increase Your Domain Rating in 2026
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-foreground">Manual Editorial Guest Posting:</strong> Secure in-content editorial mentions on authoritative industry publications in your exact niche.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-foreground">Competitor Link Gap Acquisition:</strong> Extract referring domains that link to your top 3 competitors and pitch better, updated statistics or alternatives.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-foreground">Linkable Asset Creation:</strong> Publish proprietary industry surveys, benchmarking data, or free interactive calculators that naturally attract editorial links.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div>
                <strong className="text-foreground">Digital PR &amp; Expert Commentary:</strong> Provide expert quotes to journalists on platforms like Connectively, Featured, and Qwoted to earn DR70–90+ media links.
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                5
              </div>
              <div>
                <strong className="text-foreground">Fix Broken Backlinks &amp; 301 Reclaim:</strong> Audit 404 pages on your website that still possess inbound backlinks and redirect them to active relevant pages to preserve lost link equity.
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8: EXPANDED FAQ ACCORDION */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="dr-faq-trend" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                Why does this tool show a 6-month traffic trend graph instead of just a single number?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                A single monthly traffic estimate only provides an isolated snapshot. The 6-month trendline reveals whether the website is expanding search share, maintaining steady authority, or suffering from a recent Google algorithm penalty. This historical context is vital when making link building or partnership decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-mismatch" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                Can a website have a high Domain Rating (DR) but low organic search traffic?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                Yes. Domain Rating measures backlink profile equity, not content volume. If a website possesses strong links from news outlets or university domains but has published very little content, or targets zero high-volume search terms, its DR may be 70+ while its monthly traffic remains modest.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-caching" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How does the 15-day caching system work?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                To provide instantaneous sub-millisecond response times and conserve live Ahrefs API quota, domain analyses are cached in MongoDB for 15 days. If you need to re-verify live data after a recent link building sprint, simply click the &quot;Refresh Live&quot; button to bypass cache and query fresh metrics immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-1" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How often does Ahrefs update Domain Rating (DR)?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                Ahrefs continuously recrawls the web and calculates Domain Rating dynamically. As new backlinks are indexed or lost backlinks are removed from their web graph, a domain’s DR metric adjusts accordingly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-2" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                What is the difference between Domain Rating (DR) and Moz Domain Authority (DA)?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                While both metrics measure backlink authority on a 0–100 scale, Ahrefs DR isolates pure link equity (unique referring domains and their relative authority), whereas Moz DA attempts to predict search engine ranking probability using a broader machine-learning model.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-3" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                Does a higher Domain Rating guarantee #1 rankings in Google?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                No single metric guarantees top rankings. Google evaluates search intent, content quality, page speed, technical SEO, and user experience alongside backlink authority. However, high DR gives pages a decisive competitive advantage in competitive search markets.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dr-faq-4" className="border border-border/60 rounded-2xl bg-card px-6">
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline">
                How can I hire a specialist to build high-DR backlinks for my SaaS?
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                You can book a custom link building consultation directly with Sharik Rasool. We specialize in 100% white-hat manual outreach, contextual SaaS placements, and customized DR growth sprints.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
