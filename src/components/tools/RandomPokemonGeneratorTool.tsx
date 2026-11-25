"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Copy, Check, ArrowLeft, Sparkles, Shield, Swords, Zap, HelpCircle, Trophy, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface PokemonData {
    name: string;
    type: string;
    number: number;
    gen: number;
    category: "Starter" | "Legendary" | "Pseudo-Legendary" | "Standard" | "Mythical";
    stats: {
        hp: number;
        attack: number;
        defense: number;
        spAtk: number;
        spDef: number;
        speed: number;
    };
    ability: string;
    description: string;
}

const pokemonDatabase: PokemonData[] = [
    {
        name: "Pikachu",
        type: "Electric",
        number: 25,
        gen: 1,
        category: "Standard",
        stats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
        ability: "Static / Lightning Rod",
        description: "When several of these Pokémon gather, their electricity could build and cause lightning storms. It stores electric charges in its bright red cheek pouches."
    },
    {
        name: "Charizard",
        type: "Fire/Flying",
        number: 6,
        gen: 1,
        category: "Starter",
        stats: { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
        ability: "Blaze / Solar Power",
        description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally when executing aerial flame bursts across battlefields."
    },
    {
        name: "Bulbasaur",
        type: "Grass/Poison",
        number: 1,
        gen: 1,
        category: "Starter",
        stats: { hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
        ability: "Overgrow / Chlorophyll",
        description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon, soaking in solar rays to power seed leeching moves."
    },
    {
        name: "Squirtle",
        type: "Water",
        number: 7,
        gen: 1,
        category: "Starter",
        stats: { hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
        ability: "Torrent / Rain Dish",
        description: "After birth, its back swells and hardens into a shell. It powerfully sprays water foam from its mouth while retreating into its armored carapace."
    },
    {
        name: "Gengar",
        type: "Ghost/Poison",
        number: 94,
        gen: 1,
        category: "Standard",
        stats: { hp: 60, attack: 65, defense: 60, spAtk: 130, spDef: 75, speed: 110 },
        ability: "Cursed Body",
        description: "Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright. Its chilling aura drops room temperatures by nearly 10 degrees."
    },
    {
        name: "Eevee",
        type: "Normal",
        number: 133,
        gen: 1,
        category: "Standard",
        stats: { hp: 55, attack: 55, defense: 50, spAtk: 45, spDef: 65, speed: 55 },
        ability: "Run Away / Adaptability",
        description: "Its genetic code is remarkably irregular. It may mutate into eight distinct elemental evolutions if exposed to radiation from elemental stones or affection."
    },
    {
        name: "Mewtwo",
        type: "Psychic",
        number: 150,
        gen: 1,
        category: "Legendary",
        stats: { hp: 106, attack: 110, defense: 90, spAtk: 154, spDef: 90, speed: 130 },
        ability: "Pressure / Unnerve",
        description: "Created by genetic manipulation in a clandestine laboratory on Cinnabar Island. Engineered exclusively to wield supreme psionic kinetic combat mastery."
    },
    {
        name: "Gyarados",
        type: "Water/Flying",
        number: 130,
        gen: 1,
        category: "Standard",
        stats: { hp: 95, attack: 125, defense: 79, spAtk: 60, spDef: 100, speed: 81 },
        ability: "Intimidate / Moxie",
        description: "Once Magikarp undergoes sudden metamorphosis, its brain cells mutate completely. It enters destructive rages capable of incinerating entire coastal settlements."
    },
    {
        name: "Dragonite",
        type: "Dragon/Flying",
        number: 149,
        gen: 1,
        category: "Pseudo-Legendary",
        stats: { hp: 91, attack: 134, defense: 95, spAtk: 100, spDef: 100, speed: 80 },
        ability: "Inner Focus / Multiscale",
        description: "It is said to live in the vast open sea. Despite its colossal bulky physique, it can fly faster than the speed of sound to rescue distressed naval crews."
    },
    {
        name: "Snorlax",
        type: "Normal",
        number: 143,
        gen: 1,
        category: "Standard",
        stats: { hp: 160, attack: 110, defense: 65, spAtk: 65, spDef: 110, speed: 30 },
        ability: "Immunity / Thick Fat",
        description: "Very lazy. Just eats over 800 pounds of food daily and sleeps. Its stomach digestive juices are so acidic they can digest moldy, rotten items and toxic toxins safely."
    },
    {
        name: "Lucario",
        type: "Fighting/Steel",
        number: 448,
        gen: 4,
        category: "Standard",
        stats: { hp: 70, attack: 110, defense: 70, spAtk: 115, spDef: 70, speed: 90 },
        ability: "Steadfast / Inner Focus",
        description: "By catching the aura emanating from all living things, it can read thoughts and movements to anticipate opponents' actions before they happen."
    },
    {
        name: "Garchomp",
        type: "Dragon/Ground",
        number: 445,
        gen: 4,
        category: "Pseudo-Legendary",
        stats: { hp: 108, attack: 130, defense: 95, spAtk: 80, spDef: 85, speed: 102 },
        ability: "Sand Veil / Rough Skin",
        description: "When it folds up its body and extends its wings, it looks like a jet plane. It flies at sonic speeds looking for flock prey across arid desert badlands."
    },
    {
        name: "Gardevoir",
        type: "Psychic/Fairy",
        number: 282,
        gen: 3,
        category: "Standard",
        stats: { hp: 68, attack: 65, defense: 65, spAtk: 125, spDef: 115, speed: 80 },
        ability: "Synchronize / Trace",
        description: "To protect its trainer, it has the psychokinetic power to distort dimensions and create a small black hole through supreme telepathic concentration."
    },
    {
        name: "Tyranitar",
        type: "Rock/Dark",
        number: 248,
        gen: 2,
        category: "Pseudo-Legendary",
        stats: { hp: 100, attack: 134, defense: 110, spAtk: 95, spDef: 100, speed: 61 },
        ability: "Sand Stream / Unnerve",
        description: "Its body cannot be harmed by any form of attack, so it is very eager to challenge enemies. It topples entire mountain ranges, forcing mapmakers to redraw charts."
    },
    {
        name: "Rayquaza",
        type: "Dragon/Flying",
        number: 384,
        gen: 3,
        category: "Legendary",
        stats: { hp: 105, attack: 150, defense: 90, spAtk: 150, spDef: 90, speed: 95 },
        ability: "Air Lock",
        description: "It lives in the ozone layer far above the clouds and cannot be seen from the ground. It descended to quell the cataclysmic conflict between Kyogre and Groudon."
    },
    {
        name: "Greninja",
        type: "Water/Dark",
        number: 658,
        gen: 6,
        category: "Starter",
        stats: { hp: 72, attack: 95, defense: 67, spAtk: 103, spDef: 71, speed: 122 },
        ability: "Torrent / Protean",
        description: "It creates throwing stars out of compressed water. When it spins and throws them at high speed, these stars can slice cleanly through steel beams."
    },
    {
        name: "Umbreon",
        type: "Dark",
        number: 197,
        gen: 2,
        category: "Standard",
        stats: { hp: 95, attack: 65, defense: 110, spAtk: 60, spDef: 130, speed: 65 },
        ability: "Synchronize / Inner Focus",
        description: "When exposed to the moon's aura, the yellow rings on its sleek obsidian body glow softly, striking fear into the heart of anyone or anything nearby."
    },
    {
        name: "Cinderace",
        type: "Fire",
        number: 815,
        gen: 8,
        category: "Starter",
        stats: { hp: 80, attack: 116, defense: 75, spAtk: 65, spDef: 75, speed: 119 },
        ability: "Blaze / Libero",
        description: "It juggles a pebble with its feet, turning it into a flaming soccer ball. Its energetic footwork and blazing shooting technique leave opponents dizzy."
    },
    {
        name: "Mimikyu",
        type: "Ghost/Fairy",
        number: 778,
        gen: 7,
        category: "Standard",
        stats: { hp: 55, attack: 90, defense: 80, spAtk: 50, spDef: 105, speed: 96 },
        ability: "Disguise",
        description: "It wears a ragged rag fashioned to look like Pikachu to overcome its terrible loneliness. Anyone who attempts to look beneath its disguise is stricken with illness."
    },
    {
        name: "Dragapult",
        type: "Dragon/Ghost",
        number: 887,
        gen: 8,
        category: "Pseudo-Legendary",
        stats: { hp: 88, attack: 120, defense: 75, spAtk: 100, spDef: 75, speed: 142 },
        ability: "Clear Body / Infiltrator",
        description: "When it isn't battling, it keeps Dreepy nested inside its hollow supersonic horns. During battle, it launches them at Mach speed like guided missile projectiles."
    },
    {
        name: "Zacian",
        type: "Fairy/Steel",
        number: 888,
        gen: 8,
        category: "Legendary",
        stats: { hp: 92, attack: 170, defense: 115, spAtk: 80, spDef: 115, speed: 148 },
        ability: "Intrepid Sword",
        description: "Known as the Fairy King's Sword, this hero of Galar strikes down foes with grace and speed so breathtaking that attacks appear as dazzling flashes of light."
    },
    {
        name: "Metagross",
        type: "Steel/Psychic",
        number: 376,
        gen: 3,
        category: "Pseudo-Legendary",
        stats: { hp: 80, attack: 135, defense: 130, spAtk: 95, spDef: 90, speed: 70 },
        ability: "Clear Body / Light Metal",
        description: "Formed by four Beldum joining together into an interconnected neural supercomputer. It easily calculates complex parabolic flight trajectories in real time."
    },
    {
        name: "Blastoise",
        type: "Water",
        number: 9,
        gen: 1,
        category: "Starter",
        stats: { hp: 79, attack: 83, defense: 100, spAtk: 85, spDef: 105, speed: 78 },
        ability: "Torrent / Rain Dish",
        description: "The rocket cannons extending from its shell fire water jets capable of punching holes through thick sheets of steel with pin-point trajectory precision."
    },
    {
        name: "Venusaur",
        type: "Grass/Poison",
        number: 3,
        gen: 1,
        category: "Starter",
        stats: { hp: 80, attack: 82, defense: 83, spAtk: 100, spDef: 100, speed: 80 },
        ability: "Overgrow / Chlorophyll",
        description: "The enormous tropical flower on its back blooms brightly when absorbing solar power. Its soothing floral scent calms aggressive emotions during clash bouts."
    },
    {
        name: "Darkrai",
        type: "Dark",
        number: 491,
        gen: 4,
        category: "Mythical",
        stats: { hp: 70, attack: 90, defense: 90, spAtk: 135, spDef: 90, speed: 125 },
        ability: "Bad Dreams",
        description: "It can lull people to sleep and make them dream unending nightmares. It does so only as self-defense, residing in desolate shadows to avoid causing grief."
    },
    {
        name: "Tinkaton",
        type: "Fairy/Steel",
        number: 959,
        gen: 9,
        category: "Standard",
        stats: { hp: 85, attack: 75, defense: 77, spAtk: 70, spDef: 105, speed: 94 },
        ability: "Mold Breaker / Own Tempo",
        description: "This intelligent Pokémon swung its colossal 200-pound forged metal hammer to swat rocks into the sky, knocking down unsuspecting Corviknight out of mid-air."
    },
    {
        name: "Salamence",
        type: "Dragon/Flying",
        number: 373,
        gen: 3,
        category: "Pseudo-Legendary",
        stats: { hp: 95, attack: 135, defense: 80, spAtk: 110, spDef: 80, speed: 100 },
        ability: "Intimidate / Moxie",
        description: "Driven by an intense generational desire to fly, its constant yearning restructured its genetic code, causing magnificent crimson wings to sprout in evolution."
    },
    {
        name: "Sylveon",
        type: "Fairy",
        number: 700,
        gen: 6,
        category: "Standard",
        stats: { hp: 95, attack: 65, defense: 65, spAtk: 110, spDef: 130, speed: 60 },
        ability: "Cute Charm / Pixilate",
        description: "It sends a soothing aura from its ribbon-like feelers to calm fights. Once its opponent relaxes, it executes devastating hyper-voice fairy acoustic blasts."
    },
    {
        name: "Blaziken",
        type: "Fire/Fighting",
        number: 257,
        gen: 3,
        category: "Starter",
        stats: { hp: 80, attack: 120, defense: 70, spAtk: 110, spDef: 70, speed: 80 },
        ability: "Blaze / Speed Boost",
        description: "In battle, Blaziken blows intense flames from its wrists and attacks foes courageously. The stronger the foe, the more intensely its wrists burn with martial vigor."
    },
    {
        name: "Alakazam",
        type: "Psychic",
        number: 65,
        gen: 1,
        category: "Standard",
        stats: { hp: 55, attack: 50, defense: 45, spAtk: 135, spDef: 95, speed: 120 },
        ability: "Synchronize / Magic Guard",
        description: "Its brain cells multiply continually until death. As a result, this Pokémon remembers everything that has occurred in the world since birth with an IQ over 5,000."
    }
];

const typeColors: Record<string, string> = {
    Electric: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    Fire: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    Water: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    Grass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Poison: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    Ghost: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    Psychic: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30",
    Normal: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
    Dragon: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    Flying: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    Fighting: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    Steel: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
    Dark: "bg-neutral-800/20 text-neutral-800 dark:text-neutral-200 border-neutral-700/40",
    Fairy: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    Ground: "bg-amber-700/10 text-amber-700 dark:text-amber-400 border-amber-700/30",
    Rock: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30",
};

export function RandomPokemonGeneratorTool() {
    const { toast } = useToast();
    const [selectedGen, setSelectedGen] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");

    const filteredPool = useMemo(() => {
        return pokemonDatabase.filter((p) => {
            if (selectedGen !== "all" && p.gen.toString() !== selectedGen) return false;
            if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
            if (selectedType !== "all" && !p.type.toLowerCase().includes(selectedType.toLowerCase())) return false;
            return true;
        });
    }, [selectedGen, selectedCategory, selectedType]);

    const [currentPokemon, setCurrentPokemon] = useState<PokemonData>(pokemonDatabase[0]);
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateRandom = () => {
        const pool = filteredPool.length > 0 ? filteredPool : pokemonDatabase;
        setIsAnimating(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * pool.length);
            setCurrentPokemon(pool[randomIndex]);
            setIsAnimating(false);
        }, 250);
    };

    const bst = useMemo(() => {
        const s = currentPokemon.stats;
        return s.hp + s.attack + s.defense + s.spAtk + s.spDef + s.speed;
    }, [currentPokemon]);

    const copyToClipboard = () => {
        const text = `#${currentPokemon.number} ${currentPokemon.name} (${currentPokemon.type}) [Gen ${currentPokemon.gen}]
Category: ${currentPokemon.category} | Ability: ${currentPokemon.ability}
Base Stat Total (BST): ${bst} (HP: ${currentPokemon.stats.hp}, Atk: ${currentPokemon.stats.attack}, Def: ${currentPokemon.stats.defense}, SpA: ${currentPokemon.stats.spAtk}, SpD: ${currentPokemon.stats.spDef}, Spe: ${currentPokemon.stats.speed})

${currentPokemon.description}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Pokémon info copied to clipboard!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="section py-12 md:py-16">
            <div className="container-narrow">
                <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/tools" className="hover:text-foreground">Free Tools</Link>
                    <span>/</span>
                    <span className="text-foreground">Random Pokémon Generator</span>
                </nav>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Pokémon Randomizer</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Random Pokémon Generator
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Generate random Pokémon instantly with accurate base battle stats (BST), elemental typing, generation tags, and competitive ability breakdowns. Built for Nuzlocke runs, draft leagues, and casual team drafting.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-card/70 border border-border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            Generation
                        </label>
                        <select
                            value={selectedGen}
                            onChange={(e) => setSelectedGen(e.target.value)}
                            aria-label="Filter Pokémon by Generation"
                            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="all">All Generations (1-9)</option>
                            <option value="1">Gen 1 (Kanto)</option>
                            <option value="2">Gen 2 (Johto)</option>
                            <option value="3">Gen 3 (Hoenn)</option>
                            <option value="4">Gen 4 (Sinnoh)</option>
                            <option value="6">Gen 6 (Kalos)</option>
                            <option value="7">Gen 7 (Alola)</option>
                            <option value="8">Gen 8 (Galar)</option>
                            <option value="9">Gen 9 (Paldea)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            Role / Tier
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Filter Pokémon by Category"
                            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="all">All Tiers &amp; Roles</option>
                            <option value="Starter">Starter Evolutions</option>
                            <option value="Pseudo-Legendary">Pseudo-Legendaries</option>
                            <option value="Legendary">Legendaries</option>
                            <option value="Mythical">Mythicals</option>
                            <option value="Standard">Standard Roster</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            Elemental Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            aria-label="Filter Pokémon by Type"
                            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="all">All Types</option>
                            <option value="fire">Fire</option>
                            <option value="water">Water</option>
                            <option value="grass">Grass</option>
                            <option value="electric">Electric</option>
                            <option value="psychic">Psychic</option>
                            <option value="dragon">Dragon</option>
                            <option value="ghost">Ghost</option>
                            <option value="steel">Steel</option>
                            <option value="dark">Dark</option>
                            <option value="fairy">Fairy</option>
                        </select>
                    </div>
                </div>

                {/* Generator Card */}
                <Card className={`mb-6 border-border/80 bg-card shadow-xl transition-all duration-300 ${isAnimating ? "scale-[0.98] opacity-60" : "scale-100 opacity-100"}`}>
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/60">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black tracking-wider text-muted-foreground">
                                    #{currentPokemon.number.toString().padStart(3, "0")}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-border bg-muted/60">
                                    Gen {currentPokemon.gen}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                    {currentPokemon.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground">BST Total:</span>
                                <span className="text-sm font-black text-foreground bg-muted px-2.5 py-0.5 rounded-md">
                                    {bst}
                                </span>
                            </div>
                        </div>

                        <div className="text-center my-6">
                            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
                                {currentPokemon.name}
                            </h2>
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                {currentPokemon.type.split("/").map((t) => {
                                    const badgeClass = typeColors[t] || "bg-muted text-foreground border-border";
                                    return (
                                        <span key={t} className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
                                            {t}
                                        </span>
                                    );
                                })}
                            </div>
                            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                                {currentPokemon.description}
                            </p>
                            <div className="mt-3 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">Abilities:</span> {currentPokemon.ability}
                            </div>
                        </div>

                        {/* Base Stats Grid */}
                        <div className="mt-6 pt-6 border-t border-border/60">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">
                                Base Battle Statistics
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { label: "HP", val: currentPokemon.stats.hp, max: 250, color: "bg-emerald-500" },
                                    { label: "Attack", val: currentPokemon.stats.attack, max: 190, color: "bg-red-500" },
                                    { label: "Defense", val: currentPokemon.stats.defense, max: 230, color: "bg-blue-500" },
                                    { label: "Sp. Atk", val: currentPokemon.stats.spAtk, max: 180, color: "bg-amber-500" },
                                    { label: "Sp. Def", val: currentPokemon.stats.spDef, max: 230, color: "bg-purple-500" },
                                    { label: "Speed", val: currentPokemon.stats.speed, max: 200, color: "bg-sky-500" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-background/80 border border-border/60 rounded-lg p-2.5">
                                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                            <span className="text-muted-foreground">{stat.label}</span>
                                            <span className="font-bold text-foreground">{stat.val}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${stat.color}`}
                                                style={{ width: `${Math.min(100, (stat.val / stat.max) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    <Button size="lg" onClick={generateRandom} className="gap-2 font-bold px-6 shadow-md shadow-primary/20">
                        <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                        <span>Generate Next Pokémon</span>
                    </Button>
                    <Button size="lg" variant="outline" onClick={copyToClipboard} className="gap-2 font-semibold px-6">
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? "Copied!" : "Copy Stats & Data"}</span>
                    </Button>
                </div>

                {/* Educational / Content Section for SEO Depth & Value */}
                <div className="space-y-12 border-t border-border pt-12 text-foreground">
                    <section>
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                            <Trophy className="w-4 h-4" />
                            <span>Gaming &amp; Challenge Uses</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
                            Why Use a Random Pokémon Picker?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed text-muted-foreground">
                            <div className="p-4 rounded-xl border border-border bg-card/50">
                                <h3 className="font-bold text-foreground text-base mb-1.5 flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-primary" />
                                    Nuzlocke &amp; Randomizer Challenges
                                </h3>
                                <p>
                                    Nuzlocke players use randomized picks to enforce strict route capture rules, test unconventional species, and prevent relying on standard overpowered starters like Charizard or Greninja.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card/50">
                                <h3 className="font-bold text-foreground text-base mb-1.5 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Fantasy Drafts &amp; Smogon Tournaments
                                </h3>
                                <p>
                                    Create fair snake drafts with friends by pulling random entries within specific base stat total (BST) brackets, giving every player an equitable mix of sweepers, walls, and supports.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card/50">
                                <h3 className="font-bold text-foreground text-base mb-1.5 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-primary" />
                                    Monotype &amp; Theme Team Building
                                </h3>
                                <p>
                                    Filter by single elemental types (such as pure Ghost or Steel) to generate random party rosters for gym leader roleplay runs and themed competitive brackets.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card/50">
                                <h3 className="font-bold text-foreground text-base mb-1.5 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Creative Writing &amp; Fan Art Prompts
                                </h3>
                                <p>
                                    Artists and fanfiction creators roll randomized Pokémon pairs to inspire unusual character companions, battle interactions, and unique crossover illustrations.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="p-6 rounded-2xl border border-border bg-card/40">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                            <HelpCircle className="w-4 h-4" />
                            <span>Frequently Asked Questions</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4 text-sm">
                            <div className="border-b border-border/60 pb-4">
                                <h3 className="font-bold text-foreground text-base mb-1">
                                    What does Base Stat Total (BST) mean in Pokémon?
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Base Stat Total is the sum of a Pokémon’s six primary attributes: HP, Attack, Defense, Special Attack, Special Defense, and Speed. Standard fully evolved Pokémon typically range between 480 and 540 BST, Pseudo-Legendaries boast exactly 600 BST, and major Legendaries reach 670 to 680+ BST.
                                </p>
                            </div>
                            <div className="border-b border-border/60 pb-4">
                                <h3 className="font-bold text-foreground text-base mb-1">
                                    What makes a Pokémon a &quot;Pseudo-Legendary&quot;?
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pseudo-Legendary is a fan term for species that have a 3-stage evolution line, require 1,250,000 experience points to reach level 100, and possess exactly 600 base stat points before Mega Evolution. Famous examples include Dragonite, Tyranitar, Salamence, Metagross, Garchomp, and Dragapult.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-base mb-1">
                                    Can I filter generated Pokémon by Generation or Elemental Type?
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Yes! Use the dropdown filters above to narrow your generation pool to specific regions (such as Gen 1 Kanto or Gen 4 Sinnoh), competitive roles (Starter, Legendary, Standard), or elemental affinities (Fire, Dragon, Fairy, etc.).
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cross-linking to other tools & services */}
                    <section className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">
                            Looking for digital growth and authority metrics? Check our{" "}
                            <Link href="/tools/website-authority-checker" className="text-primary font-semibold hover:underline">
                                Website Authority Checker
                            </Link>{" "}
                            or read our{" "}
                            <Link href="/blog" className="text-primary font-semibold hover:underline">
                                Search Engine Optimization Guides
                            </Link>.
                        </div>
                        <Link href="/tools">
                            <Button variant="outline" size="sm" className="shrink-0">
                                Explore All Free Tools
                            </Button>
                        </Link>
                    </section>
                </div>
            </div>
        </section>
    );
}
