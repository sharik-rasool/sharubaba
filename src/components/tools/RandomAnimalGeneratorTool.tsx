"use client";

import { useState } from "react";
import { RefreshCw, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const animals = [
    { name: "Lion", fact: "Lions are the only cats that live in groups called prides.", habitat: "African savannas", diet: "Carnivore" },
    { name: "Elephant", fact: "Elephants are the largest land animals and can live up to 70 years.", habitat: "African and Asian forests", diet: "Herbivore" },
    { name: "Penguin", fact: "Penguins can drink salt water because they have special glands to filter out the salt.", habitat: "Antarctic regions", diet: "Carnivore (fish)" },
    { name: "Dolphin", fact: "Dolphins sleep with one eye open and one half of their brain awake.", habitat: "Oceans worldwide", diet: "Carnivore (fish)" },
    { name: "Koala", fact: "Koalas sleep up to 22 hours a day and get most of their water from eucalyptus leaves.", habitat: "Australian forests", diet: "Herbivore" },
    { name: "Octopus", fact: "Octopuses have three hearts and blue blood.", habitat: "Oceans worldwide", diet: "Carnivore" },
    { name: "Giraffe", fact: "Giraffes only need 5-30 minutes of sleep per day.", habitat: "African savannas", diet: "Herbivore" },
    { name: "Red Panda", fact: "Red pandas spend most of their lives in trees and even sleep there.", habitat: "Himalayan forests", diet: "Omnivore" },
    { name: "Axolotl", fact: "Axolotls can regenerate entire limbs, including bones and nerves.", habitat: "Mexican lakes", diet: "Carnivore" },
    { name: "Mantis Shrimp", fact: "Mantis shrimp can punch with the force of a bullet.", habitat: "Tropical oceans", diet: "Carnivore" },
];

export function RandomAnimalGeneratorTool() {
    const { toast } = useToast();
    const [currentAnimal, setCurrentAnimal] = useState(animals[0]);
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateRandom = () => {
        setIsAnimating(true);
        const randomIndex = Math.floor(Math.random() * animals.length);
        setTimeout(() => {
            setCurrentAnimal(animals[randomIndex]);
            setIsAnimating(false);
        }, 300);
    };

    const copyToClipboard = () => {
        const text = `${currentAnimal.name}\n\nFact: ${currentAnimal.fact}\nHabitat: ${currentAnimal.habitat}\nDiet: ${currentAnimal.diet}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Copied to clipboard!" });
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
                    <div className="text-6xl mb-4">🦁</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Random Animal Generator</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Discover random animals with fascinating facts. Perfect for learning, writing, or just fun!
                    </p>
                </div>

                <Card className={`mb-6 transition-all duration-300 ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}>
                    <CardContent className="p-8 text-center">
                        <h2 className="text-4xl font-bold mb-4 text-primary">{currentAnimal.name}</h2>
                        <p className="text-lg mb-6 text-muted-foreground">"{currentAnimal.fact}"</p>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="p-4 rounded-lg bg-muted">
                                <p className="text-sm text-muted-foreground mb-1">Habitat</p>
                                <p className="font-medium">{currentAnimal.habitat}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted">
                                <p className="text-sm text-muted-foreground mb-1">Diet</p>
                                <p className="font-medium">{currentAnimal.diet}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={generateRandom} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                        Generate New Animal
                    </Button>
                    <Button size="lg" variant="outline" onClick={copyToClipboard} className="gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>

                <div className="prose-custom mt-12 border-t border-border/50 pt-8 max-w-2xl">
                    <h2 className="text-2xl font-semibold mb-4">About the Random Animal Generator</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Our Random Animal Generator is a fun, lightweight educational utility designed to help students, 
                        writers, and nature lovers discover wildlife species from all corners of the globe. Each click 
                        introduces a random animal accompanied by their habitat, dietary behavior, and an intriguing, less-known biological fact.
                    </p>

                    <h3 className="text-xl font-semibold mb-3">Ecosystems & Dietary Classifications</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        The generator catalogs animals living across diverse global biomes (from the freezing Antarctic shelves 
                        to tropical ocean depths and hot African savannas) and categorizes their diet:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
                        <li><strong>Carnivores:</strong> Meat-eating species whose diets consist of other animals (e.g. Lions, Octopuses, and Dolphins).</li>
                        <li><strong>Herbivores:</strong> Plant-eating species whose systems are adapted to digest vegetation (e.g. Elephants, Giraffes, and Koalas).</li>
                        <li><strong>Omnivores:</strong> Species with versatile diets consisting of both plants and meats (e.g. Red Pandas).</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">What types of species are in the database?</h4>
                            <p className="text-sm leading-relaxed">
                                The database contains mammals, birds, marine life, and unique amphibians (such as the Axolotl). We regularly update the pool to include both common animals and rare, fascinating creatures.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">How can educators use this tool?</h4>
                            <p className="text-sm leading-relaxed">
                                Teachers can use this tool for daily science warm-ups, prompting kids to write stories about the generated animal, or starting research assignments on the animal's natural habitat.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-base mb-1">Why is biological diversity important?</h4>
                            <p className="text-sm leading-relaxed">
                                Every species plays a crucial role in maintaining the balance of their respective ecosystem. Learning about unique adaptations (like the Axolotl's limb regeneration) fosters curiosity and environmental conservation awareness.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
