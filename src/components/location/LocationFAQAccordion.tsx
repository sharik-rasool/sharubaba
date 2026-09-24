"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations";

export interface FAQItem {
  question: string;
  answer: string;
}

interface LocationFAQAccordionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
}

export function LocationFAQAccordion({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about working together, pricing, deliverables, and UK market execution.",
  faqs,
}: LocationFAQAccordionProps) {
  return (
    <section className="section bg-muted/20" aria-labelledby="location-faq-heading">
      <div className="container-narrow">
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Got Questions?
            </div>
            <h2 id="location-faq-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              {subtitle}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border/70 rounded-2xl bg-card px-5 md:px-7 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-base md:text-lg py-5 hover:no-underline text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 pt-1">
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
