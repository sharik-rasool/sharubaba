"use client";

import Image from "next/image";
import { TrendingUp, ShieldCheck, Target, Clock, Sparkles, FileSpreadsheet } from "lucide-react";

export function SeoAuditHeroVisual() {
  return (
    <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-none mx-auto flex items-center justify-center">
      {/* Ambient Glow Effects */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-emerald-500/20 to-primary/10 rounded-3xl blur-3xl opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/25 rounded-full blur-[80px] pointer-events-none" />

      {/* Main 3D Book Visual Container */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl group transition-transform duration-500 hover:scale-[1.02]">
        <Image
          src="/seo-audit-book.jpg"
          alt="Custom 3D SEO & Backlink Audit Executive Report"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Subtle Inner Glass Border */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>

      {/* Floating Holographic Badge 1: Top Left - Traffic Growth */}
      <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 p-3 sm:p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-emerald-500/30 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:5s]">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="text-left pr-2">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
            Traffic Potential
          </div>
          <div className="text-xs sm:text-sm font-black text-foreground">
            +350% Growth
          </div>
        </div>
      </div>

      {/* Floating Holographic Badge 2: Top Right - Domain Rating */}
      <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 p-3 sm:p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-primary/40 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:6s] [animation-delay:1s]">
        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-left pr-2">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
            Authority Health
          </div>
          <div className="text-xs sm:text-sm font-black text-foreground">
            DR 80+ Blueprint
          </div>
        </div>
      </div>

      {/* Floating Holographic Badge 3: Bottom Left - Competitor Link Gaps */}
      <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-5 p-3 sm:p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-amber-500/30 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:5.5s] [animation-delay:2s]">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div className="text-left pr-2">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
            Competitor Intelligence
          </div>
          <div className="text-xs sm:text-sm font-black text-foreground">
            10+ Link Gaps Found
          </div>
        </div>
      </div>

      {/* Floating Holographic Badge 4: Bottom Right - Turnaround & Format */}
      <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 p-3 sm:p-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-primary/30 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:6.5s] [animation-delay:1.5s]">
        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div className="text-left pr-2">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
            Fast Turnaround
          </div>
          <div className="text-xs sm:text-sm font-black text-foreground flex items-center gap-1">
            <span>24–48h</span>
            <span className="text-[10px] text-muted-foreground font-medium">• PDF + Sheets</span>
          </div>
        </div>
      </div>
    </div>
  );
}
