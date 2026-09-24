"use client";

import { useState } from "react";
import {
  Calculator,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  RefreshCw,
  Lock,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import Link from "next/link";

// DR Pricing Table (Revealed only on Step 3)
const DR_RATES = [
  { id: "30-40", label: "DR 30–40", rate: 110, desc: "Foundational Niche Authority" },
  { id: "40-50", label: "DR 40–50", rate: 150, desc: "Growing Mid-Tier Authority" },
  { id: "50-60", label: "DR 50–60", rate: 190, desc: "Competitive SaaS & Tech Standard" },
  { id: "60-70", label: "DR 60–70", rate: 230, desc: "High Authority & Category Leaders" },
  { id: "70-80", label: "DR 70–80", rate: 265, desc: "Elite Industry Publications" },
  { id: "80-90", label: "DR 80–90", rate: 300, desc: "Tier-1 Global Media & Tech Portals" },
  { id: "90-100", label: "DR 90–100", rate: 400, desc: "Ultra-High Tier / National Publications" },
] as const;

type DrRangeId = (typeof DR_RATES)[number]["id"];

const LINK_MULTIPLES = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 25, label: "25" },
  { value: 30, label: "30+" },
] as const;

export function LinkCostEstimator() {
  // Step State: 1 = Config, 2 = Contact & Verification, 3 = Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form State (No prices shown)
  const [linkMentions, setLinkMentions] = useState<number>(10);
  const [drRange, setDrRange] = useState<DrRangeId>("50-60");

  // Step 2 Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Random Math Captcha Generator
  const [captchaNumbers] = useState<{ num1: number; num2: number }>(() => ({
    num1: Math.floor(Math.random() * 8) + 2,
    num2: Math.floor(Math.random() * 8) + 2,
  }));

  // Calculations (Calculated internally, only displayed on Step 3)
  const selectedDrObj = DR_RATES.find((d) => d.id === drRange) || DR_RATES[2];
  const unitRate = selectedDrObj.rate;
  const isPlus = linkMentions >= 30;
  const estimatedTotal = linkMentions * unitRate;

  const handleProceedToStep2 = () => {
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    // Validate Captcha
    const expectedSum = captchaNumbers.num1 + captchaNumbers.num2;
    if (parseInt(captchaAnswer.trim(), 10) !== expectedSum) {
      setCaptchaError(true);
      return;
    }

    if (!fullName || !email) return;

    setIsSubmitting(true);

    try {
      // Send Lead Notification to API
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email,
          subject: `Cost Estimator Lead: ${linkMentions}${isPlus ? "+" : ""} Links (${selectedDrObj.label} @ £${unitRate}/link = £${estimatedTotal}/mo)`,
          message: `Estimator Breakdown:\n- Name: ${fullName}\n- Email: ${email}\n- Link Mentions/Mo: ${linkMentions}${isPlus ? "+" : ""}\n- Target DR: ${selectedDrObj.label}\n- Per Link Rate: £${unitRate}\n- Estimated Monthly Total: £${estimatedTotal}${isPlus ? "+" : ""}/month`,
        }),
      });
    } catch {
      // Gracefully continue to display result
    }

    setIsSubmitting(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setCaptchaAnswer("");
    setCaptchaError(false);
  };

  return (
    <section className="section bg-card/60 border-y border-border/80" id="cost-estimator">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Context & Trust Value (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5" />
                Cost & Volume Estimator
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Calculate Your Monthly Link Building Budget
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Determine the exact monthly link velocity and domain authority level needed to outrank your competitors in the UK and international search markets.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    <strong>100% In-Content Editorial Links:</strong> High-impact contextual links on authoritative, traffic-generating publications.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    <strong>Full Domain Pre-Approval:</strong> You inspect and approve all prospective targets and anchor texts prior to outreach.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-foreground font-medium">
                    <strong>Transparent GBP (£) Retainers:</strong> Zero hidden agency fees, zero FX surprises, rolling monthly contracts.
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Compact, Fully Responsive Card (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <FadeIn delay={0.1}>
              <div className="p-4 sm:p-7 md:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl relative overflow-hidden w-full max-w-xl lg:ml-auto">
                
                {/* Step Header Indicator */}
                <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-5 sm:mb-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider w-full justify-between sm:justify-start">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold ${
                          step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        1
                      </span>
                      <span className={step === 1 ? "text-primary font-extrabold" : ""}>Parameters</span>
                    </div>

                    <span className="text-muted-foreground/40">→</span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold ${
                          step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        2
                      </span>
                      <span className={step === 2 ? "text-primary font-extrabold" : ""}>Details</span>
                    </div>

                    <span className="text-muted-foreground/40">→</span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-bold ${
                          step === 3 ? "bg-emerald-500 text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        3
                      </span>
                      <span className={step === 3 ? "text-emerald-500 font-extrabold" : ""}>Estimate</span>
                    </div>
                  </div>
                </div>

                {/* PAGE 1: LINK PARAMETERS (NO RATES DISPLAYED) */}
                {step === 1 && (
                  <div className="space-y-5 sm:space-y-6 animate-in fade-in-50 duration-300">
                    {/* 1. Link Mentions / Month */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs sm:text-sm font-bold text-foreground">
                          Link Mentions / Month:
                        </label>
                        <span className="text-[11px] sm:text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                          {linkMentions}{isPlus ? "+" : ""} links
                        </span>
                      </div>
                      {/* Responsive Grid: 3 cols on mobile, 6 cols on tablet/desktop */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {LINK_MULTIPLES.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setLinkMentions(item.value)}
                            className={`py-2.5 sm:py-3 px-1 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                              linkMentions === item.value
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-102"
                                : "bg-secondary/40 border-border/70 hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Average Domain Rating (DR) - No Prices Shown */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs sm:text-sm font-bold text-foreground">
                          Average Domain Rating:
                        </label>
                        <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground">
                          {selectedDrObj.label}
                        </span>
                      </div>

                      {/* Responsive Grid: 1 col on mobile, 2 cols on tablet/desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {DR_RATES.map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setDrRange(tier.id)}
                            className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all ${
                              drRange === tier.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                                : "border-border/70 bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                            }`}
                          >
                            <div className="font-extrabold text-xs text-foreground flex items-center justify-between">
                              <span>{tier.label}</span>
                              {tier.id === "50-60" && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/15 text-primary">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                              {tier.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="w-full rounded-xl py-5 sm:py-6 font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 gap-2 mt-1"
                    >
                      Next: Enter Details & View Estimate
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* PAGE 2: CONTACT & HUMAN VERIFICATION */}
                {step === 2 && (
                  <form onSubmit={handleStep2Submit} className="space-y-4 animate-in fade-in-50 duration-300">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Where should we send your estimate?
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                        Complete the quick human check to reveal your custom calculation.
                      </p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Jonathan Bell"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jonathan@company.co.uk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border/80 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Human Verification Box */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-secondary/40 border border-border/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-primary" />
                          Human Verification Check <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-muted-foreground">Anti-Spam</span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <div className="px-3 py-2 rounded-lg bg-card border border-border font-mono font-bold text-xs sm:text-sm text-foreground tracking-wider select-none shrink-0">
                          {captchaNumbers.num1} + {captchaNumbers.num2} = ?
                        </div>
                        <input
                          type="number"
                          required
                          placeholder="Answer"
                          value={captchaAnswer}
                          onChange={(e) => {
                            setCaptchaAnswer(e.target.value);
                            setCaptchaError(false);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        />
                      </div>

                      {captchaError && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1">
                          Incorrect answer. Please solve the calculation.
                        </p>
                      )}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-full sm:w-auto rounded-xl py-5 px-4 font-semibold text-xs gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 rounded-xl py-5 sm:py-6 font-bold text-xs sm:text-sm shadow-lg shadow-primary/25 gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          <>
                            Calculate & Reveal Estimation
                            <Sparkles className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      100% Confidential • Zero spam
                    </p>
                  </form>
                )}

                {/* PAGE 3: ESTIMATION DISPLAY (RATES SHOWN HERE) */}
                {step === 3 && (
                  <div className="space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-400">
                    <div className="text-center border-b border-border/70 pb-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Check className="w-3 h-3" />
                        Official Link Building Estimate
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-foreground">
                        Estimated Monthly Investment
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Calculated for <strong>{fullName}</strong> ({email})
                      </p>
                    </div>

                    {/* Big Price Display */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary/40 border border-primary/30 text-center space-y-3">
                      <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        Total Monthly Retainer
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                        £{estimatedTotal.toLocaleString()}
                        {isPlus && <span className="text-xl font-bold text-primary">+</span>}
                        <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">
                          / month
                        </span>
                      </div>

                      {/* Parameter Breakdown (Stack gracefully on mobile) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/70 text-left">
                        <div className="p-2.5 rounded-xl bg-card/80 border border-border/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Volume</div>
                          <div className="text-xs font-extrabold text-foreground mt-0.5">
                            {linkMentions}{isPlus ? "+" : ""} Links/Mo
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card/80 border border-border/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Domain Rating</div>
                          <div className="text-xs font-extrabold text-foreground mt-0.5">
                            {selectedDrObj.label}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card/80 border border-border/60 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">Unit Rate</div>
                          <div className="text-xs font-extrabold text-primary mt-0.5">
                            £{unitRate} / link
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guaranteed Inclusions */}
                    <div className="space-y-1.5 text-[11px] text-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>100% In-content dofollow editorial backlinks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Full domain & anchor text pre-approval</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Minimum 5,000+ verified monthly organic traffic</span>
                      </div>
                    </div>

                    {/* Action Buttons (Full width stacked on mobile) */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="w-full sm:w-auto rounded-xl py-5 px-3.5 font-semibold text-xs gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Recalculate
                      </Button>
                      <Link href="/contact" className="w-full sm:flex-1">
                        <Button className="w-full rounded-xl py-5 sm:py-6 font-bold text-xs sm:text-sm shadow-lg shadow-primary/25 gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Book Strategy Call
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
