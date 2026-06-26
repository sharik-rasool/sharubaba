import { LucideIcon, Image, Type, Quote, Wand2, Dog, Trophy, Zap } from "lucide-react";

export interface Tool {
    slug: string;
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    icon: LucideIcon;
}

export const toolsData: Tool[] = [
    {
        slug: "chatgpt-image-generator",
        title: "AI Image Prompt Generator",
        description: "Create detailed prompts for DALL-E, Midjourney, and Stable Diffusion.",
        metaTitle: "Free AI Image Prompt Generator",
        metaDescription: "Generate detailed, creative prompts for ChatGPT, Midjourney, DALL-E, and Stable Diffusion. Boost your AI art generation quality with expert prompt templates.",
        icon: Image,
    },
    {
        slug: "elf-name-generator",
        title: "Elf Name Generator",
        description: "Create mystical elvish names for your fantasy characters and stories.",
        metaTitle: "Free Elf Name Generator",
        metaDescription: "Generate unique mystical elvish names for fantasy characters, stories, and games. Try our free online elf name generator to find the perfect magical name.",
        icon: Wand2, // Using Wand2 as a proxy for fantasy/magic
    },
    {
        slug: "ieee-citation-generator",
        title: "IEEE Citation Generator",
        description: "Generate properly formatted IEEE citations for academic papers.",
        metaTitle: "Free IEEE Citation Generator",
        metaDescription: "Generate properly formatted IEEE citations and bibliography entries for academic papers. Free online citation maker for research articles, books, and websites.",
        icon: Quote,
    },
    {
        slug: "japanese-name-generator",
        title: "Japanese Name Generator",
        description: "Create authentic Japanese names with kanji and meanings.",
        metaTitle: "Free Japanese Name Generator",
        metaDescription: "Create authentic Japanese names with their kanji characters and deep linguistic meanings. Free online tool for writers, gamers, and language enthusiasts.",
        icon: Type, // Using Type for characters
    },
    {
        slug: "random-animal-generator",
        title: "Random Animal Generator",
        description: "Discover random animals with fascinating facts and details.",
        metaTitle: "Free Random Animal Generator",
        metaDescription: "Discover random animals from around the world with fascinating species facts, pictures, and habitat details. Fun and educational online animal generator tool.",
        icon: Dog,
    },
    {
        slug: "random-nfl-team-generator",
        title: "Random NFL Team Generator",
        description: "Pick a random NFL team for fantasy leagues or challenges.",
        metaTitle: "Free Random NFL Team Generator",
        metaDescription: "Generate a random NFL team instantly for fantasy football leagues, challenges, or trivia games. Free online picker tool covering all thirty-two active teams.",
        icon: Trophy,
    },
    {
        slug: "random-pokemon-generator",
        title: "Random Pokémon Generator",
        description: "Generate random Pokémon with stats and descriptions.",
        metaTitle: "Free Random Pokémon Generator",
        metaDescription: "Generate random Pokémon instantly with complete base stats, types, and official descriptions. Perfect tool for fantasy drafts, team building, and challenges.",
        icon: Zap,
    },
];
