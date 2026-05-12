"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const prefixes = ["Ael", "Ara", "Cel", "Eil", "Fae", "Gal", "Leg", "Lor", "Mel", "Nel", "Sil", "Thal", "Ven", "Zeph"];
const maleSuffixes = ["orn", "ion", "ias", "oth", "rian", "ron", "thas", "wen", "dir", "las", "riel", "ndil"];
const femaleSuffixes = ["aria", "eth", "iel", "wen", "dra", "lyn", "riel", "thea", "viel", "wyn", "lith", "nara"];
const titles = ["of the Silver Moon", "Starweaver", "Leafwhisper", "Shadowdancer", "Lightbringer", "Forestwalker", "Moonchild", "Dawnseeker"];

export function ElfNameGeneratorTool() {
    const { toast } = useToast();
    const [gender, setGender] = useState<"male" | "female">("male");
    const [includeTitle, setIncludeTitle] = useState(false);
    const [generatedName, setGeneratedName] = useState("");
    const [copied, setCopied] = useState(false);

    const generateName = () => {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffixes = gender === "male" ? maleSuffixes : femaleSuffixes;
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        let name = prefix + suffix;

        if (includeTitle) {
            const title = titles[Math.floor(Math.random() * titles.length)];
            name = `${name} ${title}`;
        }

        setGeneratedName(name);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedName);
        setCopied(true);
        toast({ title: "Name copied to clipboard!" });
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
                    <div className="text-6xl mb-4">🧝</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Elf Name Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Create mystical elvish names for your fantasy characters, D&D campaigns, or creative writing.
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <Label className="mb-3 block">Gender</Label>
                            <RadioGroup value={gender} onValueChange={(v) => setGender(v as "male" | "female")} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="elf-male" />
                                    <Label htmlFor="elf-male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="elf-female" />
                                    <Label htmlFor="elf-female">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="include-title"
                                checked={includeTitle}
                                onChange={(e) => setIncludeTitle(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="include-title">Include title/epithet</Label>
                        </div>
                        <Button onClick={generateName} className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Generate Elf Name
                        </Button>
                    </CardContent>
                </Card>

                {generatedName && (
                    <Card className="mb-6 bg-muted">
                        <CardContent className="p-8 text-center">
                            <p className="text-4xl font-bold text-primary mb-4 font-serif italic">
                                {generatedName}
                            </p>
                            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Name"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">Perfect for</h2>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Dungeons & Dragons characters</li>
                        <li>Fantasy novel writing</li>
                        <li>Video game characters</li>
                        <li>Role-playing games</li>
                        <li>World-building projects</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
