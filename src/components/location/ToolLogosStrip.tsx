import Image from "next/image";
import ahrefsLogo from "@/assets/logos/ahrefs.png";
import semrushLogo from "@/assets/logos/semrush.png";
import screamingFrogLogo from "@/assets/logos/screaming-frog.png";
import googleSearchConsoleLogo from "@/assets/logos/google-search-console.png";
import googleAnalyticsLogo from "@/assets/logos/google-analytics.png";
import mozLogo from "@/assets/logos/moz.png";

interface ToolLogosStripProps {
  title?: string;
}

export function ToolLogosStrip({
  title = "Data & Performance Verified Across Industry-Standard Platforms",
}: ToolLogosStripProps) {
  return (
    <div className="w-full py-8 text-center">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
        {title}
      </p>
      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center select-none max-w-4xl mx-auto">
        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="Ahrefs Verified Metrics"
        >
          <Image
            src={ahrefsLogo}
            alt="Ahrefs"
            className="w-[30px] h-[30px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs font-bold text-foreground">Ahrefs DR50+</span>
        </div>

        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="SEMrush Traffic Tracking"
        >
          <Image
            src={semrushLogo}
            alt="SEMrush"
            className="w-[75px] h-[20px] object-contain opacity-85 group-hover:opacity-100 dark:brightness-0 dark:invert transition-opacity"
          />
        </div>

        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="Google Search Console"
        >
          <Image
            src={googleSearchConsoleLogo}
            alt="Google Search Console"
            className="w-[28px] h-[28px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs font-bold text-foreground">Search Console</span>
        </div>

        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="Google Analytics 4"
        >
          <Image
            src={googleAnalyticsLogo}
            alt="Google Analytics"
            className="w-[28px] h-[28px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs font-bold text-foreground">GA4 Analytics</span>
        </div>

        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="Screaming Frog SEO Spider"
        >
          <Image
            src={screamingFrogLogo}
            alt="Screaming Frog"
            className="w-[28px] h-[28px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-xs font-bold text-foreground">Screaming Frog</span>
        </div>

        <div
          className="h-12 px-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:scale-105 hover:border-primary/40 duration-300 group"
          title="Moz Authority Metrics"
        >
          <Image
            src={mozLogo}
            alt="Moz"
            className="w-[70px] h-[18px] object-contain opacity-85 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}
