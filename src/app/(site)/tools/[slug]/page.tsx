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

    const toolUrl = `https://www.sharikrasool.com/tools/${slug}`;

    return {
        title: tool.metaTitle,
        description: tool.metaDescription,
        alternates: { canonical: toolUrl },
        openGraph: {
            title: tool.metaTitle,
            description: tool.metaDescription,
            url: toolUrl,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: tool.metaTitle,
            description: tool.metaDescription,
        },
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

    const toolSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.title,
        "description": tool.description,
        "url": `https://www.sharikrasool.com/tools/${tool.slug}`,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
            />
            <div className="py-8">
                <ToolComponent />
            </div>
        </>
    );
}
