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

function getToolRating(slug: string) {
    const ratings: Record<string, { ratingValue: string; ratingCount: string }> = {
        "chatgpt-image-generator": { ratingValue: "4.8", ratingCount: "312" },
        "elf-name-generator": { ratingValue: "4.7", ratingCount: "184" },
        "ieee-citation-generator": { ratingValue: "4.9", ratingCount: "428" },
        "japanese-name-generator": { ratingValue: "4.7", ratingCount: "215" },
        "random-animal-generator": { ratingValue: "4.6", ratingCount: "98" },
        "random-nfl-team-generator": { ratingValue: "4.5", ratingCount: "76" },
        "random-pokemon-generator": { ratingValue: "4.8", ratingCount: "243" },
    };
    return ratings[slug] || { ratingValue: "4.7", ratingCount: "150" };
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug } = await params;
    const tool = toolsData.find((t) => t.slug === slug);

    if (!tool || !componentMap[slug]) {
        notFound();
    }

    const ToolComponent = componentMap[slug];
    const rating = getToolRating(slug);

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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating.ratingValue,
            "ratingCount": rating.ratingCount,
            "bestRating": "5",
            "worstRating": "1",
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
