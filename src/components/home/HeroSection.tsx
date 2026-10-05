"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Link2, Star, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import sharikPortrait from "@/assets/sharik-portrait-1.jpeg";

// Tool Logo Imports
import googleAnalyticsLogo from "@/assets/logos/google-analytics.png";
import ahrefsLogo from "@/assets/logos/ahrefs.png";
import mozLogo from "@/assets/logos/moz.png";
import screamingFrogLogo from "@/assets/logos/screaming-frog.png";
import googleSearchConsoleLogo from "@/assets/logos/google-search-console.png";
import claudeLogo from "@/assets/logos/claude.png";
import semrushLogo from "@/assets/logos/semrush.png";
import antigravityLogo from "@/assets/logos/antigravity.png";

export function HeroSection() {
  return (
    <section className="section relative overflow-hidden pt-12 sm:pt-20 lg:pt-28 pb-16">
      {/* Background decorations & Smooth entrance animations */}
      <style>{`
        .hero-grid-bg {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
        }
        
        /* Smooth GPU-composited entrance animations for first visit */
        @keyframes hero-fade-up {
          0% {
            opacity: 0;
            transform: translate3d(0, 24px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes hero-image-slide-up {
          0% {
            opacity: 0;
            transform: translate3d(0, 36px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes hero-card-pop-1 {
          0% {
            opacity: 0;
            transform: translate3d(-30px, 15px, 0) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes hero-card-pop-2 {
          0% {
            opacity: 0;
            transform: translate3d(30px, 15px, 0) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .animate-hero-badge {
          animation: hero-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.05s;
        }
        .animate-hero-heading {
          animation: hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.12s;
        }
        .animate-hero-subtitle {
          animation: hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
        }
        .animate-hero-cta {
          animation: hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.28s;
        }
        .animate-hero-tools {
          animation: hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.35s;
        }
        .animate-hero-image-wrap {
          animation: hero-image-slide-up 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.18s;
          will-change: transform, opacity;
        }
        .animate-hero-card-1 {
          animation: hero-card-pop-1 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.4s;
        }
        .animate-hero-card-2 {
          animation: hero-card-pop-2 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.55s;
        }

        /* Ambient floating keyframes */
        @keyframes float-slow {
          0%, 100% { transform: translate3d(0, 0px, 0) rotate(-0.5deg); }
          50% { transform: translate3d(0, -8px, 0) rotate(0.5deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate3d(0, 0px, 0) rotate(0.5deg); }
          50% { transform: translate3d(0, 8px, 0) rotate(-0.2deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
          will-change: transform;
        }
        .animate-float-slower {
          animation: float-slower 7s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
      
      <div className="absolute inset-0 hero-grid-bg opacity-70 pointer-events-none -z-10" />

      {/* Floating blurred accent circles */}
      <div className="absolute top-1/4 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl -z-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-20 pointer-events-none" />

      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, copy and tools */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* Top Badge */}
            <div className="animate-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs md:text-sm font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              7+ Years of Proven SEO Results
            </div>

            {/* Main Heading */}
            <h1 className="animate-hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] font-bold tracking-tight leading-[1.15] mb-6 text-foreground max-w-2xl lg:max-w-none">
              SEO Strategist &amp; Link Builder{" "}
              <span className="relative inline-block text-primary">
                Driving Organic Growth.
                <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
              </span>
            </h1>

            {/* Subheading */}
            <p className="animate-hero-subtitle text-sm sm:text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl lg:max-w-2xl">
              I help SaaS and tech companies increase their domain authority, organic traffic,
              and search rankings through strategic link building and data-driven SEO.
            </p>

            {/* CTA Buttons */}
            <div className="animate-hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <Link href="/projects" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-full px-8 font-semibold gap-2 w-full sm:w-auto shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all">
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-sample-sheet-modal"));
                  }
                }}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="rounded-full px-8 font-semibold w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  View Sample Sheet
                  <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                </Button>
              </button>
            </div>

            {/* Technical Skills App Squircles */}
            <div className="animate-hero-tools mt-10 w-full text-center lg:text-left">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Tools I Work With
              </p>
              
              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start items-center select-none">
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Google Analytics">
                  <Image src={googleAnalyticsLogo} alt="Google Analytics" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Ahrefs">
                  <Image src={ahrefsLogo} alt="Ahrefs" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Google Search Console">
                  <Image src={googleSearchConsoleLogo} alt="Google Search Console" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Screaming Frog">
                  <Image src={screamingFrogLogo} alt="Screaming Frog" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Claude AI">
                  <Image src={claudeLogo} alt="Claude AI" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[48px] h-[48px] rounded-2xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Antigravity AI">
                  <Image src={antigravityLogo} alt="Antigravity AI" className="w-[36px] h-[36px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[110px] h-[32px] rounded-xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="Moz">
                  <Image src={mozLogo} alt="Moz" className="w-[90px] h-[22px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-[110px] h-[32px] rounded-xl bg-secondary/40 border border-border/30 shadow-sm flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-md active:scale-95 duration-300 group relative" title="SEMRUSH">
                  <Image src={semrushLogo} alt="SEMRUSH" className="w-[90px] h-[22px] object-contain opacity-80 group-hover:opacity-100 dark:brightness-0 dark:invert transition-all duration-300" />
                </div>
              </div>

              {/* Trust Signal */}
              <div className="mt-5 flex items-center justify-center lg:justify-start gap-2.5 text-muted-foreground text-sm font-semibold select-none">
                <div className="flex items-center gap-0.5 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  ))}
                </div>
                <span>Trusted by 50+ SaaS companies</span>
              </div>
            </div>

          </div>

          {/* Right Column: Image with Inspiration-Style Overlapping Stat Boxes */}
          <div className="lg:col-span-5 relative w-full flex flex-col items-center px-6 sm:px-10 lg:px-0 py-6 lg:py-0">
            <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] relative animate-hero-image-wrap">
              
              {/* Image & Overlapping Stat Boxes Wrapper */}
              <div className="relative mx-auto w-full aspect-[5/6]">
                
                {/* Main Portrait Frame */}
                <div className="relative w-full h-full rounded-[32px] sm:rounded-[40px] shadow-2xl border-4 border-background overflow-hidden bg-muted group">
                  <Image
                    src={sharikPortrait}
                    alt="Sharik Rasool - SEO Strategist & Link Builder"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 480px"
                    priority
                  />
                  {/* Bottom Fade gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />
                </div>

                {/* Top-Left Box: 500+ High-Quality Backlinks */}
                <div className="absolute -top-4 -left-4 sm:-top-7 sm:-left-7 z-20 animate-hero-card-1">
                  <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[24px] bg-primary text-primary-foreground shadow-2xl shadow-primary/35 border-[3.5px] sm:border-4 border-background p-2.5 sm:p-3 text-center transition-all duration-300 hover:scale-105 select-none animate-float-slow">
                    <span className="text-xl sm:text-3xl font-black tracking-tight text-white leading-none">
                      500+
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/95 leading-tight mt-1 sm:mt-1.5 text-center">
                      High-Quality<br />Backlinks
                    </span>
                  </div>
                </div>

                {/* Right Edge Box: 300% Avg Traffic Growth */}
                <div className="absolute top-[52%] -right-4 sm:-right-7 -translate-y-1/2 z-20 animate-hero-card-2">
                  <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[24px] bg-primary text-primary-foreground shadow-2xl shadow-primary/35 border-[3.5px] sm:border-4 border-background p-2.5 sm:p-3 text-center transition-all duration-300 hover:scale-105 select-none animate-float-slower">
                    <span className="text-xl sm:text-3xl font-black tracking-tight text-white leading-none">
                      300%
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/95 leading-tight mt-1 sm:mt-1.5 text-center">
                      Avg. Traffic<br />Growth
                    </span>
                  </div>
                </div>

              </div>
              
            </div>
          </div>

        </div>


      </div>
    </section>
  );
}
