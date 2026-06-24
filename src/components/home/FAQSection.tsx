"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";

const faqs = [
    {
        question: "What is your approach to SEO for SaaS and tech brands?",
        answer: "For SaaS and tech companies, I focus on a two-pronged strategy: bottom-of-funnel (BoFu) content optimization and high-authority link building. SaaS buyers are looking for solutions to specific problems, so we target high-intent keywords (like comparison keywords, alternative-to lists, and product utilities) that directly capture active buyers. I couple this with technical audits and structured data implementation to ensure search engine spiders crawl and index your product pages effectively."
    },
    {
        question: "How do you source and build high-quality backlinks?",
        answer: "I do not use PBNs, automated spam, or directory links. Every backlink is built through manual, personalized email outreach and relationship building. I identify relevant, non-competing websites in the SaaS, marketing, tech, and business niches that have strong domain authority (DA 50+) and organic traffic. By providing high-value guest contributions, resource link suggestions, and content collaborations, I secure permanent contextually relevant editor links that pass maximum link equity."
    },
    {
        question: "How long does it take to see results from SEO and link building campaigns?",
        answer: "SEO is a compounding growth channel, not an overnight fix. While minor technical fixes and optimization of existing high-intent pages can yield search rank improvements within 2 to 4 weeks, a comprehensive SEO and link-building strategy typically takes 3 to 6 months to demonstrate substantial, hockey-stick growth in organic traffic and domain authority. The velocity depends on your website's baseline authority, niche competitiveness, and execution speed."
    },
    {
        question: "Do you write the SEO content yourself or work with writers?",
        answer: "I handle content strategy, brief preparation (defining search intent, heading structures, keyword density, competitor research, and entity optimization), and editing. For the actual writing, I can collaborate with your in-house product team, coordinate with your existing freelance writers, or bring in my trusted network of vetted tech and SaaS copywriters who understand how to write engaging, expert-level content."
    },
    {
        question: "What SEO tools do you use for auditing and monitoring?",
        answer: "I utilize industry-standard tools to run audits, track rankings, and execute outreach. This includes SEMrush and Ahrefs for backlink audits and keyword research, Screaming Frog for deep technical crawls, Google Search Console and Google Analytics for performance tracking, and custom cold outreach automation systems to manage relationships with editors and publishers."
    },
    {
        question: "How do we get started working together?",
        answer: "We begin with a brief discovery call to discuss your SaaS product, target audience, budget, and organic growth goals. From there, I perform a preliminary audit of your site's current keyword presence and backlink profile. If we're a good fit, I prepare a custom, milestone-based strategy proposal outlining the action plan, expected timelines, and deliverables."
    }
];

export function FAQSection() {
    return (
        <section className="section bg-muted/20" aria-labelledby="faq-heading">
            <div className="container-narrow">
                <FadeIn>
                    <div className="text-center mb-8 md:mb-12">
                        <h2 id="faq-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
                            Clear answers about my SaaS SEO methodology, outreach strategies, and what it's like to work together.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem 
                                key={index} 
                                value={`faq-${index}`} 
                                className="border border-border/60 rounded-xl bg-card px-5 md:px-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <AccordionTrigger className="text-left font-semibold text-base md:text-lg py-4 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5 pt-1">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </FadeIn>
            </div>
        </section>
    );
}
