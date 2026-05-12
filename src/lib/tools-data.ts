import { LucideIcon, Image, Type, Quote, Wand2, Dog, Trophy, Zap } from "lucide-react";

export interface Tool {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const toolsData: Tool[] = [
    {
        slug: "chatgpt-image-generator",
        title: "AI Image Prompt Generator",
        description: "Create detailed prompts for DALL-E, Midjourney, and Stable Diffusion.",
        icon: Image,
    },
    {
        slug: "elf-name-generator",
        title: "Elf Name Generator",
        description: "Create mystical elvish names for your fantasy characters and stories.",
        icon: Wand2, // Using Wand2 as a proxy for fantasy/magic
    },
    {
        slug: "ieee-citation-generator",
        title: "IEEE Citation Generator",
        description: "Generate properly formatted IEEE citations for academic papers.",
        icon: Quote,
    },
    {
        slug: "japanese-name-generator",
        title: "Japanese Name Generator",
        description: "Create authentic Japanese names with kanji and meanings.",
        icon: Type, // Using Type for characters
    },
    {
        slug: "random-animal-generator",
        title: "Random Animal Generator",
        description: "Discover random animals with fascinating facts and details.",
        icon: Dog,
    },
    {
        slug: "random-nfl-team-generator",
        title: "Random NFL Team Generator",
        description: "Pick a random NFL team for fantasy leagues or challenges.",
        icon: Trophy,
    },
    {
        slug: "random-pokemon-generator",
        title: "Random Pokémon Generator",
        description: "Generate random Pokémon with stats and descriptions.",
        icon: Zap,
    },
];
