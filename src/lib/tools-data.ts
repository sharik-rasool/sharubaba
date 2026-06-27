import { LucideIcon, Type, Quote, Wand2, Dog, Trophy, Zap, Smile, GraduationCap, Paintbrush } from "lucide-react";

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
    {
        slug: "square-face-generator",
        title: "Square Face Generator",
        description: "Design retro text-based emoticons or draw customizable 8-bit square avatar faces.",
        metaTitle: "Free Square Face Generator",
        metaDescription: "Create retro text-based emoticons, Minecraft-style skins, or draw custom 8-bit square pixel art avatars. Export as downloadable PNG or copyable Unicode blocks.",
        icon: Smile,
    },
    {
        slug: "random-college-generator",
        title: "Random College Generator",
        description: "Generate random colleges and universities with locations, mascots, and fun facts.",
        metaTitle: "Free Random College & University Generator",
        metaDescription: "Discover random universities and colleges worldwide. Generate institution details, mascots, types, and fun facts. Perfect for students, trivia, and research.",
        icon: GraduationCap,
    },
    {
        slug: "artist-name-generator",
        title: "Artist Name Generator",
        description: "Create unique and cool pen names, DJ names, rap aliases, or painter tags.",
        metaTitle: "Free Artist Name Generator | Cool Pen Names & Aliases",
        metaDescription: "Generate unique artist names for painters, musicians, DJs, writers, and rappers. Select your genre and get instantly styled names and backstories.",
        icon: Paintbrush,
    },
];
