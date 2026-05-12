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

                <div className="mt-12 prose-custom">
                    <h2 className="text-2xl font-semibold mb-4">About This Tool</h2>
                    <p className="text-muted-foreground mb-4">
                        Our Random Animal Generator is a fun and educational tool that helps you discover amazing animals from around the world.
                        Each generation provides you with the animal's name, an interesting fact, their natural habitat, and dietary classification.
                    </p>
                    <h3 className="text-xl font-semibold mb-3">Use Cases</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Educational activities for children</li>
                        <li>Writing prompts for creative stories</li>
                        <li>Trivia games and quizzes</li>
                        <li>Learning about wildlife and biodiversity</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
