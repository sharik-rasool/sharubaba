"use client";

import { useState } from "react";
import {
  Globe,
  Mail,
  User,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Lock,
  FileSpreadsheet,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  initialWebsite?: string;
}

export function SeoAuditOrderForm({ initialWebsite = "" }: Props) {
  const [website, setWebsite] = useState(initialWebsite);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim() || !name.trim() || !email.trim()) {
      setError("Please fill in your website, name, and email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/seo-audit/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          name,
          email,
          competitors,
          targetKeywords,
          notes,
          honeypot,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to submit your audit order. Please try again.");
        return;
      }

      setOrderId(json.orderId);
      setSubmitted(true);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-card border border-emerald-500/30 shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Order Confirmed
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground">
            Your $15 SEO Audit is Queued!
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong className="text-foreground">{name}</strong>. I have received your audit request for{" "}
            <strong className="text-primary">{website}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Order Reference:</span>
            <strong className="text-foreground font-mono">{orderId}</strong>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Turnaround:</span>
            <span className="text-foreground font-semibold">24 to 48 hours</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Deliverables:</span>
            <span className="text-foreground font-semibold">PDF Deck + Excel Action Sheet</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 max-w-md mx-auto space-y-2 text-xs text-muted-foreground text-left">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            What happens next?
          </div>
          <p>
            1. I will begin pulling your historical Ahrefs backlink profile and competitor link gaps.
          </p>
          <p>
            2. You will receive an email confirmation at <strong className="text-foreground">{email}</strong> with your $15 invoice link (Stripe / PayPal) and delivery tracking.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setWebsite("");
            }}
            className="rounded-xl text-xs font-semibold"
          >
            Order Another Audit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="order-audit-section" className="p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-8">
      {/* Header & Pricing */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Secure Order Intake
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Order Your Custom SEO Audit
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Fill out your details below. Delivered directly to your inbox in 24–48 hours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/60 border border-primary/30 text-right shrink-0">
          <div className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
            One-Time Flat Price
          </div>
          <div className="text-3xl font-black text-primary tracking-tight">
            $15 <span className="text-xs font-semibold text-muted-foreground">USD</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot field for bot protection */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Website URL */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Website URL to Audit <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://yourwebsite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              Your Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              Work Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Competitor URLs */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                Top 1–2 Competitor URLs <span className="text-[11px] text-muted-foreground font-normal">(Optional for link gap analysis)</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. competitor1.com, competitor2.com"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Primary Keyword / Business Focus */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Primary Keyword or Business Focus <span className="text-[11px] text-muted-foreground font-normal">(Optional)</span></span>
            </label>
            <input
              type="text"
              placeholder="e.g. B2B SaaS CRM, Link building agency, AI writing tool"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-foreground">
              Specific Goals or Questions <span className="text-[11px] text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Any recent traffic drops, penalty concerns, or specific questions you'd like me to address in the report?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/40 border border-border/80 focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Value badges strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>24–48h Turnaround</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>PDF + Excel Sheets</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>100% Money-Back Guarantee</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl py-6 font-bold text-sm shadow-xl shadow-primary/25 gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Your Order...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Request $15 Audit Report
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground">
          🔒 Zero spam guarantee. 100% of the $15 is credited toward your first monthly link building package.
        </p>
      </form>
    </div>
  );
}
