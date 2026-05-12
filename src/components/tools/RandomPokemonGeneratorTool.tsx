"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const pokemon = [
    { name: "Pikachu", type: "Electric", number: 25, description: "When several of these Pokémon gather, their electricity could build and cause lightning storms." },
    { name: "Charizard", type: "Fire/Flying", number: 6, description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally." },
    { name: "Bulbasaur", type: "Grass/Poison", number: 1, description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon." },
    { name: "Squirtle", type: "Water", number: 7, description: "After birth, its back swells and hardens into a shell. It powerfully sprays foam from its mouth." },
    { name: "Gengar", type: "Ghost/Poison", number: 94, description: "Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright." },
    { name: "Eevee", type: "Normal", number: 133, description: "Its genetic code is irregular. It may mutate if exposed to radiation from elemental stones." },
    { name: "Mewtwo", type: "Psychic", number: 150, description: "Created by genetic manipulation. It's the most powerful Pokémon ever created." },
    { name: "Gyarados", type: "Water/Flying", number: 130, description: "Once it begins to rampage, it will not stop until everything around it is destroyed." },
    { name: "Dragonite", type: "Dragon/Flying", number: 149, description: "It is said to live in the sea. It guides ships in distress to the shore." },
    { name: "Snorlax", type: "Normal", number: 143, description: "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful." },
];

export function RandomPokemonGeneratorTool() {
    const { toast } = useToast();
    const [currentPokemon, setCurrentPokemon] = useState(pokemon[0]);
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateRandom = () => {
        setIsAnimating(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * pokemon.length);
            setCurrentPokemon(pokemon[randomIndex]);
            setIsAnimating(false);
        }, 300);
    };

    const copyToClipboard = () => {
        const text = `#${currentPokemon.number} ${currentPokemon.name} (${currentPokemon.type})\n\n${currentPokemon.description}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Pokémon info copied!" });
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
                    <div className="text-6xl mb-4">⚡</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Random Pokémon Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Discover random Pokémon for team building, nuzlocke challenges, or just for fun!
                    </p>
                </div>

                <Card className={`mb-6 transition-all duration-300 ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}>
                    <CardContent className="p-8 text-center">
                        <p className="text-sm text-muted-foreground mb-2">#{currentPokemon.number}</p>
                        <h2 className="text-4xl font-bold mb-2 text-primary">{currentPokemon.name}</h2>
                        <div className="inline-flex gap-2 mb-4">
                            {currentPokemon.type.split("/").map((type) => (
                                <span key={type} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    {type}
                                </span>
                            ))}
                        </div>
                        <p className="text-muted-foreground max-w-md mx-auto">{currentPokemon.description}</p>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={generateRandom} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                        Generate Pokémon
                    </Button>
                    <Button size="lg" variant="outline" onClick={copyToClipboard} className="gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>

                <div className="mt-12 prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Nuzlocke challenge team selection</li>
                        <li>Random team builder for battles</li>
                        <li>Creative writing inspiration</li>
                        <li>Learning about different Pokémon</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
