import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ResultsSection } from "@/components/home/ResultsSection";
import { LinkBuildingPillars } from "@/components/home/LinkBuildingPillars";
import { ProcessSection } from "@/components/home/ProcessSection";
import { AgencyComparisonSection } from "@/components/home/AgencyComparisonSection";
import { SeoAuditSpotlightSection } from "@/components/home/SeoAuditSpotlightSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
    title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
    description:
        "Senior SEO strategist and link builder. Scaled 500+ DR50–85+ editorial backlinks, organic traffic, and search rankings for high-growth SaaS and tech brands.",
    alternates: { canonical: "https://www.sharikrasool.com" },
    openGraph: {
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Senior SEO strategist and link builder. Scaled 500+ DR50–85+ editorial backlinks, organic traffic, and search rankings for high-growth SaaS and tech brands.",
        url: "https://www.sharikrasool.com",
        type: "website",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist & Link Builder" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Senior SEO strategist and link builder. Scaled 500+ DR50–85+ editorial backlinks, organic traffic, and search rankings for high-growth SaaS and tech brands.",
        images: ["/opengraph-image"],
    },
};

const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sharik Rasool - SEO Strategist & Link Builder",
    "description": "Senior SEO strategist and link builder with 7+ years of experience helping SaaS and tech companies scale domain rating and organic traffic.",
    "url": "https://www.sharikrasool.com",
    "mainEntity": {
        "@type": "Person",
        "name": "Sharik Rasool",
        "jobTitle": "SEO Strategist & Link Builder",
        "description": "7+ years of experience in SaaS SEO strategy and white-hat link building",
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
            
            {/* 1. Hero Section: Streamlined headline, $15 audit CTA, portrait & badges */}
            <HeroSection />

            {/* 2. Key Quantifiable Metrics & Results */}
            <ResultsSection />

            {/* 3. Deep SEO & Link Building Methodology Pillars */}
            <LinkBuildingPillars />

            {/* 4. Proven 4-Step Campaign Process */}
            <ProcessSection />

            {/* 5. Specialist vs Generic Agency Comparison */}
            <AgencyComparisonSection />

            {/* 6. $15 Custom SEO Audit Teardown Spotlight */}
            <SeoAuditSpotlightSection />

            {/* 7. Client Testimonials & Social Proof */}
            <TestimonialsSection />

            {/* 8. Detailed FAQ Accordion */}
            <FAQSection />

            {/* 9. Final High-Converting Conversion Section */}
            <CTASection />
        </>
    );
}
