import { notFound } from "next/navigation";
import { toolsData } from "@/lib/tools-data";
import { ChatGPTImageGeneratorTool } from "@/components/tools/ChatGPTImageGeneratorTool";
import { ElfNameGeneratorTool } from "@/components/tools/ElfNameGeneratorTool";
import { IEEECitationGeneratorTool } from "@/components/tools/IEEECitationGeneratorTool";
import { JapaneseNameGeneratorTool } from "@/components/tools/JapaneseNameGeneratorTool";
import { RandomAnimalGeneratorTool } from "@/components/tools/RandomAnimalGeneratorTool";
import { RandomNFLTeamGeneratorTool } from "@/components/tools/RandomNFLTeamGeneratorTool";
import { RandomPokemonGeneratorTool } from "@/components/tools/RandomPokemonGeneratorTool";
import { Metadata } from "next";

// Map slugs to components
const componentMap: Record<string, React.ComponentType> = {
    "chatgpt-image-generator": ChatGPTImageGeneratorTool,
    "elf-name-generator": ElfNameGeneratorTool,
    "ieee-citation-generator": IEEECitationGeneratorTool,
    "japanese-name-generator": JapaneseNameGeneratorTool,
    "random-animal-generator": RandomAnimalGeneratorTool,
    "random-nfl-team-generator": RandomNFLTeamGeneratorTool,
    "random-pokemon-generator": RandomPokemonGeneratorTool,
};

interface ToolPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tool = toolsData.find((t) => t.slug === slug);
    if (!tool) return {};

    return {
        title: `${tool.title} - Sharik Rasool Tools`,
        description: tool.description,
    };
}

export function generateStaticParams() {
    return toolsData.map((tool) => ({
        slug: tool.slug,
    }));
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug } = await params;
    const tool = toolsData.find((t) => t.slug === slug);

    if (!tool || !componentMap[slug]) {
        notFound();
    }

    const ToolComponent = componentMap[slug];

    return (
        <div className="py-8">
            <ToolComponent />
        </div>
    );
}
