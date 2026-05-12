"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const nflTeams = [
    { name: "Arizona Cardinals", conference: "NFC", division: "West", color: "#97233F" },
    { name: "Atlanta Falcons", conference: "NFC", division: "South", color: "#A71930" },
    { name: "Baltimore Ravens", conference: "AFC", division: "North", color: "#241773" },
    { name: "Buffalo Bills", conference: "AFC", division: "East", color: "#00338D" },
    { name: "Carolina Panthers", conference: "NFC", division: "South", color: "#0085CA" },
    { name: "Chicago Bears", conference: "NFC", division: "North", color: "#0B162A" },
    { name: "Cincinnati Bengals", conference: "AFC", division: "North", color: "#FB4F14" },
    { name: "Cleveland Browns", conference: "AFC", division: "North", color: "#311D00" },
    { name: "Dallas Cowboys", conference: "NFC", division: "East", color: "#003594" },
    { name: "Denver Broncos", conference: "AFC", division: "West", color: "#FB4F14" },
    { name: "Detroit Lions", conference: "NFC", division: "North", color: "#0076B6" },
    { name: "Green Bay Packers", conference: "NFC", division: "North", color: "#203731" },
    { name: "Houston Texans", conference: "AFC", division: "South", color: "#03202F" },
    { name: "Indianapolis Colts", conference: "AFC", division: "South", color: "#002C5F" },
    { name: "Jacksonville Jaguars", conference: "AFC", division: "South", color: "#006778" },
    { name: "Kansas City Chiefs", conference: "AFC", division: "West", color: "#E31837" },
    { name: "Las Vegas Raiders", conference: "AFC", division: "West", color: "#000000" },
    { name: "Los Angeles Chargers", conference: "AFC", division: "West", color: "#0080C6" },
    { name: "Los Angeles Rams", conference: "NFC", division: "West", color: "#003594" },
    { name: "Miami Dolphins", conference: "AFC", division: "East", color: "#008E97" },
    { name: "Minnesota Vikings", conference: "NFC", division: "North", color: "#4F2683" },
    { name: "New England Patriots", conference: "AFC", division: "East", color: "#002244" },
    { name: "New Orleans Saints", conference: "NFC", division: "South", color: "#D3BC8D" },
    { name: "New York Giants", conference: "NFC", division: "East", color: "#0B2265" },
    { name: "New York Jets", conference: "AFC", division: "East", color: "#125740" },
    { name: "Philadelphia Eagles", conference: "NFC", division: "East", color: "#004C54" },
    { name: "Pittsburgh Steelers", conference: "AFC", division: "North", color: "#FFB612" },
    { name: "San Francisco 49ers", conference: "NFC", division: "West", color: "#AA0000" },
    { name: "Seattle Seahawks", conference: "NFC", division: "West", color: "#002244" },
    { name: "Tampa Bay Buccaneers", conference: "NFC", division: "South", color: "#D50A0A" },
    { name: "Tennessee Titans", conference: "AFC", division: "South", color: "#0C2340" },
    { name: "Washington Commanders", conference: "NFC", division: "East", color: "#5A1414" },
];

export function RandomNFLTeamGeneratorTool() {
    const { toast } = useToast();
    const [currentTeam, setCurrentTeam] = useState(nflTeams[0]);
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateRandom = () => {
        setIsAnimating(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * nflTeams.length);
            setCurrentTeam(nflTeams[randomIndex]);
            setIsAnimating(false);
        }, 300);
    };

    const copyToClipboard = () => {
        const text = `${currentTeam.name} (${currentTeam.conference} ${currentTeam.division})`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Team copied to clipboard!" });
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
                    <div className="text-6xl mb-4">🏈</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Random NFL Team Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Pick a random NFL team for fantasy leagues, Madden challenges, or settling debates!
                    </p>
                </div>

                <Card className={`mb-6 transition-all duration-300 ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}>
                    <CardContent className="p-8 text-center">
                        <div
                            className="w-16 h-16 rounded-full mx-auto mb-4"
                            style={{ backgroundColor: currentTeam.color }}
                        />
                        <h2 className="text-3xl font-bold mb-4">{currentTeam.name}</h2>
                        <div className="flex justify-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                                {currentTeam.conference}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                                {currentTeam.division} Division
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={generateRandom} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                        Pick Random Team
                    </Button>
                    <Button size="lg" variant="outline" onClick={copyToClipboard} className="gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>

                <div className="mt-12 prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Fantasy football team assignments</li>
                        <li>Madden franchise random selection</li>
                        <li>Deciding which team to root for</li>
                        <li>Random team challenges</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
