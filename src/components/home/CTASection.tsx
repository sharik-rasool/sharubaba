import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";

export function CTASection() {
  return (
    <section className="section relative overflow-hidden" aria-labelledby="cta-heading">
      <style>{`
        .cta-grid-bg {
          background-image: 
            linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
        }
      `}</style>
      
      {/* Background glowing decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="container-wide px-4 md:px-6 lg:px-8">
        <FadeIn>
          <div className="relative rounded-[32px] overflow-hidden border border-border/50 dark:border-white/10 bg-gradient-to-br from-background via-secondary/15 to-background dark:from-neutral-950 dark:via-neutral-900/40 dark:to-neutral-950 p-8 md:p-16 text-center shadow-xl">
            
            {/* Grid pattern background inside card */}
            <div className="absolute inset-0 cta-grid-bg opacity-40 pointer-events-none" />
            
            {/* Glowing Accent Orbs inside the card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              
              {/* Top Mini Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider mb-6 border border-primary/20 select-none">
                <Sparkles className="h-3.5 w-3.5 fill-primary/10 dark:fill-primary/20" />
                <span>Let's Collaborate</span>
              </div>

              {/* Main Heading */}
              <h2 
                id="cta-heading" 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.15]"
              >
                Ready to Grow Your <br />
                <span className="bg-gradient-to-r from-primary via-primary/95 to-primary/80 bg-clip-text text-transparent">
                  Organic Traffic?
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                Let's discuss how strategic SEO and link building can transform your online presence,
                rocket your search rankings, and drive sustainable growth for your business.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
                <a 
                  href="https://calendly.com/sharikkashmiri" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    className="h-[52px] sm:h-[56px] px-8 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-[0_4px_20px_rgba(22,163,74,0.35)] dark:shadow-[0_4px_20px_rgba(34,197,94,0.25)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 gap-2.5 w-full sm:w-auto group"
                  >
                    <span>Book a Free Consultation</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </a>
                
                <Link href="/projects" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-[52px] sm:h-[56px] px-8 rounded-2xl text-base font-bold border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto"
                  >
                    View Case Studies
                  </Button>
                </Link>
              </div>

              {/* Trust Subtext */}
              <p className="mt-8 text-xs font-semibold text-neutral-500 dark:text-neutral-400 select-none">
                No commitment required • 30-minute custom strategy session
              </p>

            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
