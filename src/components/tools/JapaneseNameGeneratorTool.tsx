"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const maleNames = [
    { name: "Hiroshi", meaning: "Generous", kanji: "寛" },
    { name: "Takeshi", meaning: "Fierce, warrior", kanji: "武" },
    { name: "Kenji", meaning: "Intelligent second son", kanji: "賢二" },
    { name: "Yuto", meaning: "Gentle person", kanji: "優斗" },
    { name: "Haruki", meaning: "Shining sun", kanji: "春樹" },
    { name: "Ren", meaning: "Lotus", kanji: "蓮" },
    { name: "Kaito", meaning: "Ocean flying", kanji: "海斗" },
    { name: "Sota", meaning: "Smooth and big", kanji: "颯太" },
];

const femaleNames = [
    { name: "Sakura", meaning: "Cherry blossom", kanji: "桜" },
    { name: "Yuki", meaning: "Snow", kanji: "雪" },
    { name: "Hana", meaning: "Flower", kanji: "花" },
    { name: "Aiko", meaning: "Beloved child", kanji: "愛子" },
    { name: "Mei", meaning: "Beautiful", kanji: "芽依" },
    { name: "Rin", meaning: "Dignified", kanji: "凛" },
    { name: "Himari", meaning: "Sunshine", kanji: "陽葵" },
    { name: "Akari", meaning: "Light", kanji: "あかり" },
];

const surnames = [
    { name: "Tanaka", meaning: "Rice field middle", kanji: "田中" },
    { name: "Yamamoto", meaning: "Base of the mountain", kanji: "山本" },
    { name: "Suzuki", meaning: "Bell tree", kanji: "鈴木" },
    { name: "Sato", meaning: "Wisteria village", kanji: "佐藤" },
    { name: "Nakamura", meaning: "Middle village", kanji: "中村" },
    { name: "Watanabe", meaning: "To cross over", kanji: "渡辺" },
];

export function JapaneseNameGeneratorTool() {
    const { toast } = useToast();
    const [gender, setGender] = useState<"male" | "female">("male");
    const [generatedName, setGeneratedName] = useState<{
        firstName: typeof maleNames[0];
        surname: typeof surnames[0];
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const generateName = () => {
        const names = gender === "male" ? maleNames : femaleNames;
        const firstName = names[Math.floor(Math.random() * names.length)];
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        setGeneratedName({ firstName, surname });
    };

    const copyToClipboard = () => {
        if (!generatedName) return;
        const text = `${generatedName.surname.name} ${generatedName.firstName.name} (${generatedName.surname.kanji} ${generatedName.firstName.kanji})`;
        navigator.clipboard.writeText(text);
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
                    <div className="text-6xl mb-4">🇯🇵</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Japanese Name Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Create authentic Japanese names complete with kanji characters and their beautiful meanings.
                    </p>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <Label className="mb-3 block">Gender</Label>
                            <RadioGroup value={gender} onValueChange={(v) => setGender(v as "male" | "female")} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <Button onClick={generateName} className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Generate Name
                        </Button>
                    </CardContent>
                </Card>

                {generatedName && (
                    <Card className="mb-6 bg-muted">
                        <CardContent className="p-8 text-center">
                            <p className="text-5xl font-bold mb-2 font-serif">
                                {generatedName.surname.kanji} {generatedName.firstName.kanji}
                            </p>
                            <p className="text-2xl text-primary mb-4">
                                {generatedName.surname.name} {generatedName.firstName.name}
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                                <div className="p-3 rounded-lg bg-background">
                                    <p className="text-xs text-muted-foreground mb-1">Surname Meaning</p>
                                    <p className="font-medium text-sm">{generatedName.surname.meaning}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background">
                                    <p className="text-xs text-muted-foreground mb-1">First Name Meaning</p>
                                    <p className="font-medium text-sm">{generatedName.firstName.meaning}</p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied!" : "Copy Name"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">About Japanese Names</h2>
                    <p className="text-muted-foreground mb-4">
                        Japanese names are written with kanji (Chinese characters) and carry deep meanings.
                        The family name (surname) comes first, followed by the given name. Each kanji character
                        has its own meaning, making Japanese names rich in symbolism.
                    </p>
                </div>
            </div>
        </section>
    );
}
