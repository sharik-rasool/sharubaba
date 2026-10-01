"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Sparkles, Wrench, FileText, CheckCircle2, AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EngineSetting {
    key?: string;
    isPaused: boolean;
    pausedAt?: string | Date;
    pausedBy?: string;
    reason?: string;
}

interface EngineControlCardProps {
    initialSetting?: EngineSetting;
    totalBlogs?: number;
}

export default function EngineControlCard({
    initialSetting = { isPaused: true },
    totalBlogs = 104
}: EngineControlCardProps) {
    const [isPaused, setIsPaused] = useState<boolean>(initialSetting.isPaused);
    const [pausedAt, setPausedAt] = useState<string | Date | undefined>(initialSetting.pausedAt);
    const [pausedBy, setPausedBy] = useState<string | undefined>(initialSetting.pausedBy);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleToggle = async () => {
        const nextState = !isPaused;
        setLoading(true);
        setFeedback(null);

        try {
            const res = await fetch("/api/automation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: nextState ? "pause" : "resume",
                    reason: nextState ? "Paused by admin to focus on existing content review & optimization." : ""
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setIsPaused(data.isPaused);
                if (data.isPaused) {
                    setPausedAt(new Date().toISOString());
                    setPausedBy("You");
                    setFeedback({
                        type: "success",
                        text: "Generation engine paused. Daily automated blog creation is stopped."
                    });
                } else {
                    setFeedback({
                        type: "success",
                        text: "Generation engine resumed. Daily automation is active."
                    });
                }
            } else {
                throw new Error(data.error || "Failed to update engine status.");
            }
        } catch (err: unknown) {
            setFeedback({
                type: "error",
                text: (err as Error).message || "Failed to communicate with server."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={cn(
            "overflow-hidden border-2 transition-all shadow-md",
            isPaused
                ? "border-amber-400/80 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background dark:border-amber-600/70"
                : "border-emerald-500/80 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background dark:border-emerald-600/70"
        )}>
            <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            isPaused
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        )}>
                            {isPaused ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                                    AI Blog Generation Engine
                                </h2>
                                <Badge
                                    className={cn(
                                        "font-semibold text-xs uppercase px-2.5 py-0.5 tracking-wider",
                                        isPaused
                                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-500/20"
                                            : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/20"
                                    )}
                                >
                                    {isPaused ? "⏸️ Engine Paused" : "🟢 Engine Active (Auto-Run)"}
                                </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {isPaused
                                    ? "Automatic blog creation is stopped. The site is currently in Content Quality & Repair mode."
                                    : "Automatic daily pipeline is running. New articles are drafted and scheduled daily."}
                            </p>
                        </div>
                    </div>

                    {/* Pause / Play Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            onClick={handleToggle}
                            disabled={loading}
                            size="lg"
                            className={cn(
                                "font-bold text-sm shadow-md transition-all h-11 px-5 gap-2",
                                isPaused
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-amber-600 hover:bg-amber-700 text-white"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isPaused ? (
                                <Play className="h-4 w-4 fill-current" />
                            ) : (
                                <Pause className="h-4 w-4 fill-current" />
                            )}
                            {isPaused ? "Resume / Play Engine" : "Pause Generation Engine"}
                        </Button>
                    </div>
                </div>

                {/* Banner message when paused */}
                {isPaused && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>
                                <strong>Focusing on Existing Content:</strong> No new blogs will be created by GitHub Actions or automation. You have <strong>{totalBlogs} published posts</strong> ready for audit and optimization.
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link href="/admin/blogs/diagnostics">
                                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 border-amber-300 dark:border-amber-800 bg-background hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200">
                                    <Wrench className="h-3.5 w-3.5" />
                                    Diagnostics & Auto-Repair
                                </Button>
                            </Link>
                            <Link href="/admin/blogs">
                                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 border-amber-300 dark:border-amber-800 bg-background hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200">
                                    <FileText className="h-3.5 w-3.5" />
                                    Review All Posts
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Feedback notification */}
                {feedback && (
                    <div className={cn(
                        "p-2.5 rounded-md text-xs font-medium flex items-center justify-between animate-in fade-in duration-200",
                        feedback.type === "success"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                    )}>
                        <div className="flex items-center gap-2">
                            {feedback.type === "success" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                            )}
                            <span>{feedback.text}</span>
                        </div>
                        <button onClick={() => setFeedback(null)} className="text-muted-foreground hover:text-foreground text-sm px-1">
                            ×
                        </button>
                    </div>
                )}

                {/* Metadata footer */}
                {pausedAt && isPaused && (
                    <div className="text-[11px] text-muted-foreground pt-1 flex items-center gap-3 flex-wrap border-t border-border/50">
                        <span>Paused on: <strong>{new Date(pausedAt).toLocaleDateString()} at {new Date(pausedAt).toLocaleTimeString()}</strong></span>
                        {pausedBy && <span>By: <strong>{pausedBy}</strong></span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
