import { Metadata } from "next";
import { ToolsHubDirectory } from "@/components/tools/ToolsHubDirectory";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "Free SEO, Productivity & Creative Online Tools | Sharik Rasool",
    description:
        "Free SEO utilities, domain rating checkers, and authority audit tools. Built fast and free for founders, marketers, and SEO specialists.",
    alternates: { canonical: "https://www.sharikrasool.com/tools" },
    openGraph: {
        title: "Free SEO, Productivity & Creative Online Tools | Sharik Rasool",
        description:
            "Free SEO utilities, domain rating checkers, and authority audit tools. Built fast and free for founders, marketers, and SEO specialists.",
        url: "https://www.sharikrasool.com/tools",
        type: "website",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free SEO, Productivity & Creative Online Tools | Sharik Rasool",
        description:
            "Free SEO utilities, domain rating checkers, and authority audit tools. Built fast and free for founders, marketers, and SEO specialists.",
        images: ["/opengraph-image"],
    },
};

export default function ToolsPage() {
    return (
        <div className="container-wide py-12 md:py-16">
            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    Free Web Utilities Hub
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                    Free Online Tools &amp; Generators
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    A suite of professional SEO checkers, writing helpers, and creative tools built to streamline your workflow and drive organic growth.
                </p>
            </div>

            {/* Interactive Categorized Directory with Spotlight on Top */}
            <ToolsHubDirectory />

            {/* Explanatory Content Section to increase Text-to-HTML ratio and build SEO value */}
            <div className="mt-20 md:mt-28 border-t border-border/50 pt-12 md:pt-16 max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none mb-12 space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold">Why Use My Free Online Tools?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Whether you are a developer formatting citations, a creative writer mapping out fantasy worlds, 
                        or a prompt engineer crafting AI image inputs, having quick access to utility generators saves 
                        valuable time. Our collection of online tools is designed with simplicity and speed in mind, providing 
                        instant, copy-ready outputs without the need for registration or downloads.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">1. Academic & Writing</h3>
                            <p className="text-sm text-muted-foreground">
                                Format IEEE citations and list bibliography entries instantly for your technical research reports, essays, and publications.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">2. Creative & Roleplay</h3>
                            <p className="text-sm text-muted-foreground">
                                Generate authentic Japanese names complete with kanji characters, or create mystical elvish names for your D&D sessions.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">3. Developer & AI Prompting</h3>
                            <p className="text-sm text-muted-foreground">
                                Refine image generation prompts for DALL-E, Midjourney, and Stable Diffusion to capture exactly the style you need.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem 
                            value="tools-faq-1" 
                            className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                        >
                            <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                Are all generators and calculators on this site completely free to use?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1">
                                Yes. All utilities, citation makers, name creators, and AI prompt tools listed here are 100% free to use. There are no premium lockouts, usage limits, or hidden fees.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem 
                            value="tools-faq-2" 
                            className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                        >
                            <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                Do you store or log any input data that I enter?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1">
                                No. We respect your data privacy. All text manipulations, names generated, and citation inputs are processed entirely client-side inside your web browser. We do not store, log, or track any data you enter into the input fields.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem 
                            value="tools-faq-3" 
                            className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm"
                        >
                            <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                                Can I use the names and prompts generated for commercial projects?
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-1">
                                Yes. Any elvish name, Japanese name, or Midjourney/ChatGPT prompt you generate using our tools is entirely yours to use for commercial, creative, academic, or gaming projects with no attribution required.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
