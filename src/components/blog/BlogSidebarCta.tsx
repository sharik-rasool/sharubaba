import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function BlogSidebarCta() {
    return (
        <div className="bg-gradient-to-br from-primary/5 via-muted/40 to-muted/20 border border-primary/20 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                <span>UK Link Building &amp; SEO</span>
            </div>

            <div>
                <h4 className="font-bold text-base text-foreground leading-snug">
                    Need High-DR Backlinks That Move Rankings?
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    100% white-hat manual outreach, contextual editorial placements, and tailored search strategies for growth.
                </p>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>DR50–85+ Verified Domains</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Zero PBNs or Link Networks</span>
                </div>
            </div>

            <div className="pt-2 space-y-2">
                <Link
                    href="/link-builder-uk"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                >
                    <span>View UK Link Building</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-muted/80 text-foreground text-xs font-medium rounded-lg hover:bg-muted transition-colors border border-border/60"
                >
                    <span>Book Strategy Call</span>
                </Link>
            </div>
        </div>
    );
}
