import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ResultsSection } from "@/components/home/ResultsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
    title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
    description:
        "Expert SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies grow organically. 500+ high-quality backlinks built.",
    alternates: { canonical: "https://www.sharikrasool.com" },
    openGraph: {
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Expert SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies grow organically. 500+ high-quality backlinks built.",
        url: "https://www.sharikrasool.com",
        type: "website",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Expert SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies grow organically. 500+ high-quality backlinks built.",
        images: ["/opengraph-image"],
    },
};

const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sharik Rasool - SEO Strategist & Link Builder",
    "description": "Expert SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies grow organically.",
    "url": "https://www.sharikrasool.com",
    "mainEntity": {
        "@type": "Person",
        "name": "Sharik Rasool",
        "jobTitle": "SEO Strategist & Link Builder",
        "description": "7+ years of experience in SEO strategy and link building",
        "url": "https://www.sharikrasool.com",
        "sameAs": [
            "https://www.linkedin.com/in/sharik-rasool-074155174/",
            "https://www.instagram.com/growithsharik",
        ],
    },
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
        },
    })),
};

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <HeroSection />
            <ResultsSection />
            <ProcessSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
        </>
    );
}
