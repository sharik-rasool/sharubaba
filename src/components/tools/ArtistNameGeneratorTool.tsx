"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft, Paintbrush, Music, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface GenreData {
    prefixes: string[];
    suffixes: string[];
    vibes: string[];
    description: string;
}

const genreDatabase: Record<string, GenreData> = {
    classical: {
        prefixes: ["Julian", "Aria", "Celeste", "Sebastian", "Clara", "Felix", "Beatrice", "Oliver", "Evelyn", "Gabriel", "Sophia", "Lucas", "Marina", "Dominic"],
        suffixes: ["Sterling", "Vance", "Valen", "Thorne", "Harlow", "Sinclair", "Mercer", "Devereux", "Kingsley", "Hawthorne", "Laurent", "Vane", "Stirling", "Ashford"],
        vibes: [
            "Impressionistic oil paintings, gallery exhibitions, hot espresso, classical violin.",
            "Minimalist marble sculptures, high-ceiling museums, sketchbooks, soft charcoal.",
            "Grand watercolor landscapes, renaissance cathedrals, ink drawings, dramatic lighting."
        ],
        description: "Elegant, sophisticated names inspired by painters, sculptors, and classical composers."
    },
    hiphop: {
        prefixes: ["Lil", "Young", "Big", "MC", "DJ", "Kid", "Yung", "Baby", "Yung", "Grandmaster", "Rich", "Major", "K-"],
        suffixes: ["Verse", "Rhyme", "Flow", "Beats", "Cash", "Storm", "Ace", "Blaze", "Smoke", "Ghost", "Crown", "Spit", "Glow", "Spade"],
        vibes: [
            "Heavy basslines, gold chains, street cyphers, baggy hoodies, concrete cityscapes.",
            "Freestyle battles, drum machines, vinyl scratches, neon signs, underground clubs.",
            "Poetic lyricism, late-night recording studios, boom-bap rhythms, street murals."
        ],
        description: "Gritty, powerful aliases suitable for rappers, lyricists, and hip-hop producers."
    },
    electronic: {
        prefixes: ["Neon", "Cyber", "Volt", "Synth", "Audio", "Echo", "Prism", "Binary", "Rogue", "Sonic", "Static", "Solar", "Glitch", "Pulse"],
        suffixes: ["Beat", "Freq", "Wave", "Volt", "Pulse", "Synapse", "Nexus", "Grid", "Matrix", "Spark", "Helix", "Orbit", "Echo", "Freq"],
        vibes: [
            "Neon-lit warehouse parties, modular synthesizers, laser shows, 3:00 AM energy.",
            "Cyberpunk virtual realities, retro drum machines, glitch aesthetics, deep house loops.",
            "Cosmic ambient soundscapes, analog tape delays, stargazing, deep digital synthesis."
        ],
        description: "Futuristic, energetic tags ideal for DJs, synthwave creators, and EDM producers."
    },
    indie: {
        prefixes: ["The Velvet", "Luna & The", "Amber", "Golden", "Midnight", "Rusty", "Iron", "Glass", "Wild", "Lost", "Paper", "Echo", "Bitter", "Quiet"],
        suffixes: ["Echoes", "Owls", "Horizon", "Wolves", "Harbor", "Canyon", "Hearts", "Anchor", "Crowns", "Ravens", "Shadows", "Rivers", "Pines", "Loom"],
        vibes: [
            "Acoustic guitar strums, vinyl record collections, foggy forests, cozy coffee shops.",
            "Retro cassette tapes, thrift-store sweaters, polaroid cameras, sunset road trips.",
            "Indie folk harmonies, campfire embers, typewriters, old bookstores, rainy afternoons."
        ],
        description: "Melodic, moody band names and singer-songwriter pen names."
    },
    street: {
        prefixes: ["Ghost-", "Cyber-", "Aerosol-", "Pixel-", "Spray-", "Urban-", "Iron-", "Dark-", "Vandal-", "Wild-", "Retro-"],
        suffixes: ["X", "Cypher", "Vandal", "Shade", "Ink", "Hazard", "Kross", "Shadow", "Trace", "Glitch", "Drift", "Vector", "Tag", "Stencil"],
        vibes: [
            "Fresh spray paint, brick walls, midnight operations, heavy hoodies, stencil prints.",
            "Subway tunnels, wheatpaste poster walls, neon paint drips, industrial zones.",
            "Pixel art stickers, skateboarding, chain-link fences, rooftop views at dawn."
        ],
        description: "Sharp, punchy tags tailored for graffiti writers, muralists, and street artists."
    }
};

export function ArtistNameGeneratorTool() {
    const { toast } = useToast();
    const [genre, setGenre] = useState<string>("classical");
    const [seedInput, setSeedInput] = useState<string>("");
    const [generatedName, setGeneratedName] = useState<string>("");
    const [generatedVibe, setGeneratedVibe] = useState<string>("");
    const [copied, setCopied] = useState(false);

    const generateName = () => {
        const data = genreDatabase[genre as keyof typeof genreDatabase];
        if (!data) return;

        let name = "";
        const prefix = data.prefixes[Math.floor(Math.random() * data.prefixes.length)];
        const suffix = data.suffixes[Math.floor(Math.random() * data.suffixes.length)];

        // Mix in the user seed input if provided
        if (seedInput.trim().length > 0) {
            const seed = seedInput.trim();
            // Handle mixing logic based on genre
            if (genre === "classical") {
                name = `${seed} ${suffix}`;
            } else if (genre === "hiphop" || genre === "electronic") {
                name = `${prefix} ${seed}`;
            } else if (genre === "indie") {
                name = `${prefix} ${seed}`;
            } else {
                name = `${seed}-${suffix}`;
            }
        } else {
            // Default random combination
            if (genre === "street") {
                name = `${prefix}${suffix}`;
            } else if (genre === "classical") {
                name = `${prefix} ${suffix}`;
            } else {
                name = `${prefix} ${suffix}`;
            }
        }

        setGeneratedName(name);
        
        // Random vibe select
        const vibe = data.vibes[Math.floor(Math.random() * data.vibes.length)];
        setGeneratedVibe(vibe);
    };

    const copyToClipboard = () => {
        if (!generatedName) return;
        const details = `Artist Name: ${generatedName}\nGenre Vibe: ${generatedVibe}`;
        navigator.clipboard.writeText(details);
        setCopied(true);
        toast({ title: "Artist name copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="section bg-muted/20 min-h-screen">
            <div className="container-narrow">
                <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tools
                </Link>

                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <h1 className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">Artist Name Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Discover your creative persona. Generate unique aliases, pen names, DJ tags, rap handles, or street artist signatures.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left: Input parameters */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-lg border-b pb-2 mb-4">Generator Settings</h3>
                                
                                {/* Genre Selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="genre-select">Art Style / Genre</Label>
                                    <select
                                        id="genre-select"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="classical">Fine Art / Classical</option>
                                        <option value="hiphop">Hip Hop / Rap</option>
                                        <option value="electronic">Electronic / DJ</option>
                                        <option value="indie">Indie / Rock Band</option>
                                        <option value="street">Street Art / Tag</option>
                                    </select>
                                </div>

                                {/* Optional Seed Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="seed-input">Base Word / Your Name <span className="text-[10px] text-muted-foreground">(Optional)</span></Label>
                                    <Input
                                        id="seed-input"
                                        type="text"
                                        placeholder="e.g. Luna, Astro, Nova"
                                        value={seedInput}
                                        onChange={(e) => setSeedInput(e.target.value)}
                                        maxLength={15}
                                    />
                                </div>

                                <Button onClick={generateName} className="w-full gap-2 font-bold py-6 mt-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Generate Name
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Output card */}
                    <div className="md:col-span-2">
                        {generatedName ? (
                            <Card className="border-border/50 shadow-md bg-card overflow-hidden">
                                <div className="bg-primary/5 p-6 border-b border-border/40 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        <span className="text-[10px] uppercase font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
                                            {genre.replace("classical", "Fine Art").replace("hiphop", "Hip Hop").toUpperCase()}
                                        </span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1.5 text-xs">
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        {copied ? "Copied" : "Copy Name"}
                                    </Button>
                                </div>
                                <CardContent className="p-8 md:p-12 text-center space-y-6">
                                    {/* Artist Name display */}
                                    <div className="py-6">
                                        <p className="text-3xl md:text-5xl font-extrabold text-primary font-serif tracking-tight select-all">
                                            {generatedName}
                                        </p>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-widest mt-3">
                                            Your Creative Alias
                                        </p>
                                    </div>

                                    {/* Vibe Details */}
                                    <div className="border-t border-border/50 pt-6 max-w-md mx-auto">
                                        <h4 className="font-bold text-xs uppercase text-foreground tracking-wider mb-2 flex items-center justify-center gap-1.5">
                                            🌟 Art Persona Vibe
                                        </h4>
                                        <p className="text-sm leading-relaxed text-muted-foreground italic font-medium">
                                            "{generatedVibe}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-border/50 border-2 border-dashed bg-card/50">
                                <CardContent className="p-16 text-center space-y-4">
                                    <div className="text-6xl">🎨</div>
                                    <h3 className="font-bold text-lg text-foreground">No Artist Name Generated Yet</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                                        Choose your art genre, optionally enter your name as a seed, and click the button to discover your creative alias.
                                    </p>
                                    <Button onClick={generateName} className="gap-2">
                                        <RefreshCw className="h-4 w-4" />
                                        Generate Name
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Educational SEO content section */}
                <div className="prose-custom mt-16 border-t border-border/50 pt-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">What is an Artist Name Generator?</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        An Artist Name Generator is a creative tool that helps creators, musicians, writers, DJs, and painters 
                        conceive a memorable pen name, tag, or stage alias. Throughout history, artists have adopted unique personas 
                        to define their style, protect their privacy, or explore new dimensions of their creative work.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Understanding the Stylistic Genres</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                        Creative personas reflect the culture and energy of their specific artistic field:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-3 mb-8">
                        <li>
                            <strong>Fine Art & Classical:</strong> Elegant, multi-syllabic names with European roots, conveying prestige, 
                            sculpted depth, and museum gallery quality (e.g. <em>Julian Sinclair</em>, <em>Celeste Devereux</em>).
                        </li>
                        <li>
                            <strong>Hip Hop & Rap:</strong> Rhythmically punchy aliases with typical prefixes (Lil, Kid, MC) and powerful 
                            word endings, projecting confidence and street authority (e.g. <em>Yung Blaze</em>, <em>Lil Flow</em>).
                        </li>
                        <li>
                            <strong>Electronic / DJ:</strong> Digital, high-energy names combining scientific, technical, or light-focused 
                            words, perfect for sound synthesis and night warehouse sets (e.g. <em>Cyber Pulse</em>, <em>Neon Grid</em>).
                        </li>
                        <li>
                            <strong>Indie / Rock Band:</strong> Poetic, nature-themed compound names evoking cozy, analog acoustic 
                            aesthetics and late-night campfire vibes (e.g. <em>Luna & The Canyon</em>, <em>The Velvet Wolves</em>).
                        </li>
                        <li>
                            <strong>Street Art & Graffiti:</strong> Short, aggressive, one-word tags with a suffix or number, designed 
                            for high-contrast spray stencils and sticker tags (e.g. <em>Aerosol Vandal</em>, <em>Ghost-Cypher</em>).
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
