"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const styles = ["Photorealistic", "Digital Art", "Oil Painting", "Watercolor", "Anime", "3D Render", "Pencil Sketch"];
const subjects = ["Landscape", "Portrait", "Animal", "Architecture", "Fantasy", "Sci-Fi", "Abstract", "Nature"];
const moods = ["Dramatic", "Peaceful", "Mysterious", "Vibrant", "Dark", "Ethereal", "Nostalgic", "Futuristic"];

export function ChatGPTImageGeneratorTool() {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [config, setConfig] = useState({
        subject: "",
        style: "",
        mood: "",
        customDetails: "",
    });

    const generatePrompt = () => {
        const style = config.style || styles[Math.floor(Math.random() * styles.length)];
        const subject = config.subject || subjects[Math.floor(Math.random() * subjects.length)];
        const mood = config.mood || moods[Math.floor(Math.random() * moods.length)];

        const templates = [
            `A ${mood.toLowerCase()} ${subject.toLowerCase()} scene, ${style.toLowerCase()} style, highly detailed, cinematic lighting, 8k resolution${config.customDetails ? `, ${config.customDetails}` : ""}`,
            `${style} of a ${mood.toLowerCase()} ${subject.toLowerCase()}, intricate details, professional quality, trending on ArtStation${config.customDetails ? `, ${config.customDetails}` : ""}`,
            `Masterful ${style.toLowerCase()} depicting ${subject.toLowerCase()} with ${mood.toLowerCase()} atmosphere, ultra high definition, award-winning${config.customDetails ? `, ${config.customDetails}` : ""}`,
        ];

        setPrompt(templates[Math.floor(Math.random() * templates.length)]);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        toast({ title: "Prompt copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="section">
            <div className="container-narrow">
                <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Image Prompt Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Create detailed prompts for DALL-E, Midjourney, and Stable Diffusion to generate stunning AI artwork.
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Art Style</Label>
                                <Select value={config.style} onValueChange={(v) => setConfig({ ...config, style: v })}>
                                    <SelectTrigger><SelectValue placeholder="Random" /></SelectTrigger>
                                    <SelectContent>
                                        {styles.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={config.subject} onValueChange={(v) => setConfig({ ...config, subject: v })}>
                                    <SelectTrigger><SelectValue placeholder="Random" /></SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Mood</Label>
                                <Select value={config.mood} onValueChange={(v) => setConfig({ ...config, mood: v })}>
                                    <SelectTrigger><SelectValue placeholder="Random" /></SelectTrigger>
                                    <SelectContent>
                                        {moods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Custom Details (optional)</Label>
                            <Input
                                value={config.customDetails}
                                onChange={(e) => setConfig({ ...config, customDetails: e.target.value })}
                                placeholder="e.g., golden hour lighting, cherry blossoms"
                            />
                        </div>
                        <Button onClick={generatePrompt} className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Generate Prompt
                        </Button>
                    </CardContent>
                </Card>

                {prompt && (
                    <Card className="mb-6 bg-muted">
                        <CardContent className="p-6">
                            <Label className="mb-2 block">Generated Prompt</Label>
                            <p className="text-lg mb-4">{prompt}</p>
                            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Prompt"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">How to Use This Tool</h2>
                    <p className="text-muted-foreground mb-4">
                        This AI image prompt generator helps you create effective prompts for popular AI art generators.
                        Select your preferred style, subject, and mood, or leave them random for creative inspiration.
                    </p>
                    <h3 className="text-xl font-semibold mb-3">Supported Platforms</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>ChatGPT with DALL-E 3</li>
                        <li>Midjourney</li>
                        <li>Stable Diffusion</li>
                        <li>Leonardo AI</li>
                        <li>Adobe Firefly</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
