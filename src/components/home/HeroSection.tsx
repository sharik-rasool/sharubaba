import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Link2, Star, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
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
      {/* Background decorations */}
      <style>{`
        .hero-grid-bg {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.5) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0.5deg); }
          50% { transform: translateY(8px) rotate(-0.2deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 7s ease-in-out infinite;
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
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs md:text-sm font-semibold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                7+ Years of Proven SEO Results
              </div>
            </FadeIn>

            {/* Main Heading */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] font-bold tracking-tight leading-[1.15] mb-6 text-foreground max-w-2xl lg:max-w-none">
                SEO Strategist & Link Builder{" "}
                <span className="relative inline-block text-primary">
                  Driving Organic Growth.
                  <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
                </span>
              </h1>
            </FadeIn>

            {/* Subheading */}
            <FadeIn delay={0.2}>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl lg:max-w-2xl">
                I help SaaS and tech companies increase their domain authority, organic traffic,
                and search rankings through strategic link building and data-driven SEO.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={0.3} className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0">
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full px-8 font-semibold gap-2 w-full sm:w-auto shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all">
                    View My Work
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="rounded-full px-8 font-semibold w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300">
                    Get in Touch
                    <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Technical Skills App Squircles */}
            <FadeIn delay={0.35} className="mt-10 w-full text-center lg:text-left">
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
            </FadeIn>

          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5 relative w-full flex flex-col items-center px-8 sm:px-12 lg:px-0 py-6 lg:py-0">
            <FadeIn delay={0.4} className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none relative">
              
              {/* Image & Float Cards Wrapper */}
              <div className="relative mx-auto w-full aspect-[5/6]">
                
                {/* Main Portrait Frame */}
                <div className="relative w-full h-full rounded-[36px] shadow-2xl border-4 border-background overflow-hidden bg-muted group">
                  <Image
                    src={sharikPortrait}
                    alt="Sharik Rasool - SEO Strategist & Link Builder"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  {/* Bottom Fade gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-10" />
                </div>

                {/* Floating Card 1: Backlinks (Left Edge - Lower Middle) - Desktop Only */}
                <div className="hidden lg:flex absolute top-[68%] lg:left-[-120px] xl:left-[-150px] 2xl:left-[-175px] z-20 animate-float-slow bg-white/35 dark:bg-black/35 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-lg rounded-2xl py-2 px-3.5 items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group select-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center border border-primary/20 shadow-sm shrink-0 transition-transform duration-300 group-hover:rotate-12">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-none mb-0.5">Backlinks</span>
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-800 dark:text-neutral-100 leading-none">500+ High-Quality</span>
                  </div>
                </div>

                {/* Floating Card 2: Traffic Growth (Right Edge - Upper Middle) - Desktop Only */}
                <div className="hidden lg:flex absolute top-[14%] lg:right-[-30px] xl:right-[-60px] 2xl:right-[-120px] z-20 animate-float-slower bg-white/35 dark:bg-black/35 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-lg rounded-2xl py-2 px-3.5 items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group select-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center border border-primary/20 shadow-sm shrink-0 transition-transform duration-300 group-hover:rotate-12">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-none mb-0.5">Traffic Growth</span>
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-800 dark:text-neutral-100 leading-none">300% Avg Growth</span>
                  </div>
                </div>

              </div>

              {/* Mobile Stats Cards (Displayed below the image on mobile/tablet, hidden on desktop) */}
              <div className="lg:hidden mt-6 flex flex-col gap-3.5 w-full">
                {/* Mobile Card 1: Backlinks */}
                <div className="bg-secondary/40 border border-border/30 shadow-md rounded-2xl py-3 px-4 flex items-center gap-3 w-full transition-all duration-300 hover:scale-102 active:scale-98 group select-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center border border-primary/20 shadow-sm shrink-0">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-none mb-1">Backlinks</span>
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-neutral-100 leading-none">500+ High-Quality</span>
                  </div>
                </div>

                {/* Mobile Card 2: Traffic Growth */}
                <div className="bg-secondary/40 border border-border/30 shadow-md rounded-2xl py-3 px-4 flex items-center gap-3 w-full transition-all duration-300 hover:scale-102 active:scale-98 group select-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center border border-primary/20 shadow-sm shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 leading-none mb-1">Traffic Growth</span>
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-neutral-100 leading-none">300% Avg Growth</span>
                  </div>
                </div>
              </div>
              
            </FadeIn>
          </div>

        </div>


      </div>
    </section>
  );
}
