import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toolsData } from "@/lib/tools-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Free Online Tools - Sharik Rasool",
    description: "A collection of free online tools for developers, writers, and creators. Generators, converters, and utilities.",
};

export default function ToolsPage() {
    return (
        <div className="container-wide py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Free Online Tools</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A collection of helpful utilities and generators to boost your productivity and creativity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolsData.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block h-full group">
                            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 group-hover:-translate-y-1">
                                <CardHeader>
                                    <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{tool.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
