import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, Award, ArrowRight, ExternalLink, Sparkles } from "lucide-react";

export function AuthorBio() {
  return (
    <div
      itemScope
      itemType="https://schema.org/Person"
      itemProp="author"
      className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 shadow-lg space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
        {/* Author Avatar & Verified Badge */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-primary/30 bg-muted shadow-md relative">
            <Image
              src="/avatar-512.png"
              alt="Sharik Rasool - Senior SEO & Link Building Specialist"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
              itemProp="image"
            />
          </div>
          <div
            className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md ring-4 ring-card flex items-center justify-center"
            title="Verified SEO & Link Building Specialist"
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Author Details & Bio */}
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h3
              itemProp="name"
              className="text-xl sm:text-2xl font-black text-foreground tracking-tight"
            >
              Sharik Rasool
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              Verified Author
            </span>
          </div>

          <p
            itemProp="jobTitle"
            className="text-xs sm:text-sm font-semibold text-primary/90 uppercase tracking-wider"
          >
            Senior Freelance SEO &amp; Editorial Link Building Specialist
          </p>

          <p
            itemProp="description"
            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
          >
            Sharik Rasool is a senior SEO strategist and manual outreach link builder with over 8 years of hands-on experience scaling search rankings for SaaS, tech startups, and digital publishers. Having secured 500+ high-authority DR50–85+ editorial placements, he specializes in data-backed technical audits, competitor backlink gap matrices, and white-hat outreach systems.
          </p>

          {/* E-E-A-T Credential Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-medium text-foreground/85">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary/80 border border-border/60">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>8+ Years SEO Experience</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary/80 border border-border/60">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>500+ DR50–85+ Placements</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary/80 border border-border/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% White-Hat Outreach</span>
            </div>
          </div>

          {/* Action Links & Profile */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3 border-t border-border/50 text-xs font-bold">
            <Link
              href="/about"
              itemProp="url"
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <span>View Full Bio &amp; Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="text-muted-foreground/40 hidden sm:inline">•</span>

            <a
              href="https://www.linkedin.com/in/sharik-rasool"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <span className="text-muted-foreground/40 hidden sm:inline">•</span>

            <Link
              href="/seo-audit"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
            >
              <span>Order $15 SEO Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
