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

                <div className="prose-custom mt-12 border-t border-border/50 pt-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">How Elvish Naming Works</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        In fantasy literature and tabletop games like Dungeons & Dragons, Elvish names are known for their 
                        melodic, flowing sounds and rich, natural symbolism. Classic elvish naming follows a prefix-suffix 
                        structure where syllables are combined to represent qualities of light, nature, magic, or heroism.
                    </p>

                    <h3 className="text-xl font-medium mb-3">Linguistic Roots and Suffix Meanings</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Many names are built from high-elvish syllables (strongly inspired by J.R.R. Tolkien's Quenya and Sindarin languages):
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
                        <li><strong>Male Suffixes:</strong> Ends like <em>-las</em> (leaf, as in Legolas), <em>-riel</em> (crowned/noble), <em>-dor</em> (land), or <em>-wen</em> (maiden/pure, occasionally gender-neutral).</li>
                        <li><strong>Female Suffixes:</strong> Often use soft endings like <em>-iel</em> (daughter of), <em>-wyn</em> (fair/joy), <em>-eth</em> (female designation), or <em>-nara</em> (gift).</li>
                        <li><strong>Epithets & Titles:</strong> High-born elves are often addressed with their names followed by an honorific title or family legacy description, such as <em>Starweaver</em> or <em>of the Silver Moon</em>.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">Can I use these elvish names in my books or games?</h4>
                            <p className="text-sm leading-relaxed">
                                Yes. All names generated by this tool are free to use. You can use them for characters in D&D campaigns, video games, web fiction, or published fantasy novels.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">What fantasy universes are these names inspired by?</h4>
                            <p className="text-sm leading-relaxed">
                                Our generator blends patterns from classic high fantasy lore, including Tolkien's Middle-earth, the Forgotten Realms of D&D, Warhammer, and Elder Scrolls.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">How can I select a surname or family name?</h4>
                            <p className="text-sm leading-relaxed">
                                Elves frequently identify by their house name or clan title, which are usually compound words derived from natural elements (e.g. <em>Leafwhisper</em>, <em>Dawnseeker</em>, or <em>Forestwalker</em>).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
