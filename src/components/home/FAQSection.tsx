"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";
import { faqs } from "@/data/faqs";

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
