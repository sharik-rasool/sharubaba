"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Search,
  Sparkles,
  Briefcase,
  Gamepad2,
  Layers,
  Globe,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { toolsData, toolCategories, ToolCategory, Tool } from "@/lib/tools-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ToolsHubDirectory() {
  const [activeCategory, setActiveCategory] = useState<"all" | ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredTool = toolsData.find((t) => t.featured) || toolsData[0];

  const filteredTools = toolsData.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (catId: "all" | ToolCategory) => {
    switch (catId) {
      case "seo":
        return <Activity className="w-4 h-4" />;
      case "work":
        return <Briefcase className="w-4 h-4" />;
      case "fun":
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getCategoryCount = (catId: "all" | ToolCategory) => {
    if (catId === "all") return toolsData.length;
    return toolsData.filter((t) => t.category === catId).length;
  };

  const getCategoryBadgeClass = (cat: ToolCategory) => {
    switch (cat) {
      case "seo":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "work":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "fun":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="space-y-12">
      {/* FEATURED TOOL SPOTLIGHT ON TOP */}
      {featuredTool && (
        <div className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/30 shadow-2xl overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured SEO &amp; Growth Tool
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary border border-border/80 text-muted-foreground">
                  Ahrefs API v3 Powered
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
                {featuredTool.title}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                {featuredTool.description}
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/60 font-medium">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span>Domain Rating (DR 0–100)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/60 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Search Traffic</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/60 font-medium">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>Referring Domains &amp; Backlinks</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <Link
                href={`/tools/${featuredTool.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-102 active:scale-98 transition-all group/btn"
              >
                <span>Launch Authority Checker</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
              <span className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
                100% Free • No signup required
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-border/60">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {toolCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all select-none ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-102"
                    : "bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/80"
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* TOOLS GRID */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/60">
          <p className="text-muted-foreground text-sm">No tools found matching your search.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-bold text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block h-full group">
                <Card className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-primary/50 group-hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryBadgeClass(
                          tool.category
                        )}`}
                      >
                        {tool.badge || tool.categoryLabel}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 flex-1 flex flex-col justify-between">
                    <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {tool.description}
                    </CardDescription>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
