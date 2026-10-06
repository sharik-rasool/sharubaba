import { LucideIcon, Type, Quote, Wand2, Dog, Trophy, Zap, Smile, GraduationCap, Paintbrush, Activity, Globe, Sparkles } from "lucide-react";

export type ToolCategory = "seo" | "work" | "fun";

export interface Tool {
    slug: string;
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    icon: LucideIcon;
    category: ToolCategory;
    categoryLabel: string;
    badge?: string;
    featured?: boolean;
}

export const toolCategories: { id: "all" | ToolCategory; label: string; description: string }[] = [
    { id: "all", label: "All Tools", description: "Explore our full suite of free SEO, productivity, and creative tools." },
    { id: "seo", label: "SEO & Growth", description: "Data-driven SEO utilities to analyze backlinks, traffic, and ranking authority." },
    { id: "work", label: "Work & Productivity", description: "Academic citation makers and professional writing utilities." },
    { id: "fun", label: "Fun & Creative", description: "Random generators for gaming, creative worldbuilding, and entertainment." },
];

export const toolsData: Tool[] = [
    {
        slug: "website-authority-checker",
        title: "Website Authority & Traffic Checker",
        description: "Check live Ahrefs Domain Rating (DR), estimated monthly organic search traffic, and backlink profile strength for any domain in real time.",
        metaTitle: "Free Website Authority & Traffic Checker | Ahrefs DR & Search Volume",
        metaDescription: "Check live Ahrefs Domain Rating (DR), estimated monthly organic search traffic, and backlink profile strength for any website. Free SEO tool by Sharik Rasool.",
        icon: Activity,
        category: "seo",
        categoryLabel: "SEO & Growth",
        badge: "Featured Ahrefs API",
        featured: true,
    },
    {
        slug: "ieee-citation-generator",
        title: "IEEE Citation Generator",
        description: "Generate properly formatted IEEE citations and bibliography entries for academic papers, journals, books, and online sources.",
        metaTitle: "Free IEEE Citation Generator",
        metaDescription: "Generate properly formatted IEEE citations and bibliography entries for academic papers. Free online citation maker for research articles, books, and websites.",
        icon: Quote,
        category: "work",
        categoryLabel: "Work & Productivity",
        badge: "Academic",
    },
    {
        slug: "artist-name-generator",
        title: "Artist Name Generator",
        description: "Create unique and cool pen names, DJ names, rap aliases, or painter tags complete with stylistic backstories.",
        metaTitle: "Free Artist Name Generator | Cool Pen Names & Aliases",
        metaDescription: "Generate unique artist names for painters, musicians, DJs, writers, and rappers. Select your genre and get instantly styled names and backstories.",
        icon: Paintbrush,
        category: "work",
        categoryLabel: "Work & Productivity",
        badge: "Creative Work",
    },
    {
        slug: "elf-name-generator",
        title: "Elf Name Generator",
        description: "Create mystical elvish names with lore meanings for fantasy RPG characters, stories, and D&D sessions.",
        metaTitle: "Free Elf Name Generator",
        metaDescription: "Generate unique mystical elvish names for fantasy characters, stories, and games. Try our free online elf name generator to find the perfect magical name.",
        icon: Wand2,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Fantasy RPG",
    },
    {
        slug: "japanese-name-generator",
        title: "Japanese Name Generator",
        description: "Create authentic Japanese names complete with authentic kanji characters, romaji, and deep linguistic meanings.",
        metaTitle: "Free Japanese Name Generator",
        metaDescription: "Create authentic Japanese names with their kanji characters and deep linguistic meanings. Free online tool for writers, gamers, and language enthusiasts.",
        icon: Type,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Anime & Gaming",
    },
    {
        slug: "random-pokemon-generator",
        title: "Random Pokémon Generator",
        description: "Generate random Pokémon instantly with complete base battle stats, types, abilities, and official descriptions.",
        metaTitle: "Free Random Pokémon Generator",
        metaDescription: "Generate random Pokémon instantly with complete base stats, types, and official descriptions. Perfect tool for fantasy drafts, team building, and challenges.",
        icon: Zap,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Gaming",
    },
    {
        slug: "square-face-generator",
        title: "Square Face Generator",
        description: "Design retro text-based ASCII emoticons or draw customizable 8-bit square avatar faces for Minecraft and web profiles.",
        metaTitle: "Free Square Face Generator",
        metaDescription: "Create retro text-based emoticons, Minecraft-style skins, or draw custom 8-bit square pixel art avatars. Export as downloadable PNG or copyable Unicode blocks.",
        icon: Smile,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Pixel Art",
    },
    {
        slug: "random-animal-generator",
        title: "Random Animal Generator",
        description: "Discover random animals from around the world with fascinating species facts, pictures, and habitat details.",
        metaTitle: "Free Random Animal Generator",
        metaDescription: "Discover random animals from around the world with fascinating species facts, pictures, and habitat details. Fun and educational online animal generator tool.",
        icon: Dog,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Trivia & Nature",
    },
    {
        slug: "random-nfl-team-generator",
        title: "Random NFL Team Generator",
        description: "Pick a random NFL football team instantly for fantasy football leagues, draft orders, or trivia challenges.",
        metaTitle: "Free Random NFL Team Generator",
        metaDescription: "Generate a random NFL team instantly for fantasy football leagues, challenges, or trivia games. Free online picker tool covering all thirty-two active teams.",
        icon: Trophy,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Sports Trivia",
    },
    {
        slug: "random-college-generator",
        title: "Random College Generator",
        description: "Discover random universities and colleges worldwide with institution details, mascots, locations, and fun facts.",
        metaTitle: "Free Random College & University Generator",
        metaDescription: "Discover random universities and colleges worldwide. Generate institution details, mascots, types, and fun facts. Perfect for students, trivia, and research.",
        icon: GraduationCap,
        category: "fun",
        categoryLabel: "Fun & Creative",
        badge: "Education Trivia",
    },
];
