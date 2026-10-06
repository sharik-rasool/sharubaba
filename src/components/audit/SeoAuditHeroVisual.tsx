"use client";

import { useState } from "react";
import Image from "next/image";
import { TrendingUp, ShieldCheck, Target, Clock, Sparkles, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export function SeoAuditHeroVisual() {
  const [rotate, setRotate] = useState({ x: 6, y: -18 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Dynamic tilt calculation
    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 24 - 12;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 6, y: -18 });
  };

  return (
    <div
      className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] mx-auto py-2 sm:py-3 flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
    >
      {/* Ambient Backdrop Glows */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/35 via-emerald-500/20 to-primary/10 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute w-56 h-56 bg-primary/20 rounded-full blur-[70px] pointer-events-none" />

      {/* 3D BOOK WRAPPER */}
      <div
        className="relative transition-transform duration-300 ease-out cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? "scale(1.04)" : "scale(1)"}`,
        }}
      >
        {/* Book Shadows */}
        <div
          className="absolute -bottom-8 left-6 right-6 h-10 bg-black/50 blur-xl rounded-full transition-opacity duration-300"
          style={{ transform: "rotateX(90deg) translateZ(-80px)" }}
        />

        {/* 3D Book Container */}
        <div
          className="relative w-[280px] sm:w-[310px] h-[390px] sm:h-[430px] rounded-r-2xl rounded-l-md bg-gradient-to-br from-[#0B0F17] via-[#0F172A] to-[#0B1329] border border-emerald-500/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            boxShadow:
              "inset 4px 0 10px rgba(0,0,0,0.8), inset 0 0 20px rgba(16,185,129,0.1), 18px 20px 35px rgba(0,0,0,0.6)",
          }}
        >
          {/* Spine Binding Line (Left edge of hardcover) */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/40 to-transparent border-r border-white/5 pointer-events-none" />
          <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-gradient-to-b from-amber-400/40 via-emerald-500/40 to-amber-400/40 pointer-events-none" />

          {/* Luxury Metallic Gold Geometric Border */}
          <div className="absolute inset-3.5 rounded-xl border border-amber-400/25 pointer-events-none" />
          <div className="absolute inset-5 rounded-lg border border-primary/20 pointer-events-none" />

          {/* Corner Gold Accents */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-amber-400/70" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-amber-400/70" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-amber-400/70" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-amber-400/70" />

          {/* BOOK HEADER: Sharik Rasool Monogram & Badge */}
          <div className="relative pl-3 pt-1 space-y-3">
            <div className="flex items-center justify-between">
              {/* Logo / Monogram */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/90 border border-emerald-500/50 flex items-center justify-center shadow-inner">
                  <span className="font-mono text-xs font-black tracking-tighter text-white">
                    sr<span className="text-emerald-400">.</span>
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white tracking-tight leading-none">
                    sharik rasool<span className="text-emerald-400">.</span>
                  </div>
                  <div className="text-[8px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                    sharikrasool.com
                  </div>
                </div>
              </div>

              {/* Gold Executive Badge */}
              <div className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[8px] font-extrabold uppercase tracking-widest shadow-sm">
                Executive Edition
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          </div>

          {/* BOOK CENTER: Big Bold Typography */}
          <div className="relative pl-3 text-left space-y-2.5 my-auto py-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
              Comprehensive Audit
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
              SEO &amp; <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                BACKLINK
              </span> <br />
              AUDIT REPORT
            </h3>

            <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium leading-relaxed max-w-[210px]">
              Competitor Link Gap Matrix &amp; Tailored 90-Day Authority Growth Blueprint
            </p>
          </div>

          {/* BOOK FOOTER: Verification Seals & Author info */}
          <div className="relative pl-3 pb-1 space-y-3">
            {/* Metric Preview Pill inside cover */}
            <div className="p-2.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ahrefs Verified Data</span>
              </div>
              <span className="font-extrabold text-emerald-400">$15 Deliverable</span>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10 pt-2">
              <span>PDF Deck + Excel Sheets</span>
              <span className="font-semibold text-slate-200">24–48h Turnaround</span>
            </div>
          </div>

          {/* 3D Paper Pages Edge (Simulated book depth on right side) */}
          <div
            className="absolute top-2.5 bottom-2.5 right-0 w-3 bg-gradient-to-l from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af] rounded-r-sm shadow-inner pointer-events-none opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #f3f4f6 0px, #f3f4f6 2px, #d1d5db 3px, #d1d5db 4px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
