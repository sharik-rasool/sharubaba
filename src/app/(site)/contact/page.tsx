import type { Metadata } from 'next';
import { ContactPageContent } from "@/components/contact/ContactPageContent";

const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
        "@type": "ProfessionalService",
        "name": "Sharik Rasool - SEO Services",
        "description": "Professional SEO strategy and link building services for SaaS and tech brands",
        "email": "hi@sharikrasool.com",
        "url": "https://www.sharikrasool.com",
        "priceRange": "$$",
    },
};

export const metadata: Metadata = {
    title: "Contact | Free SEO Consultation",
    description:
        "Get in touch with Sharik Rasool for SEO strategy and link building services. Free initial consultation for SaaS and tech brands worldwide.",
    alternates: { canonical: "https://www.sharikrasool.com/contact" },
    openGraph: {
        title: "Contact | Free SEO Consultation",
        description:
            "Get in touch with Sharik Rasool for SEO strategy and link building services. Free initial consultation for SaaS and tech brands worldwide.",
        url: "https://www.sharikrasool.com/contact",
        type: "website",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist" }],
    },
    twitter: {
        card: "summary",
        title: "Contact | Free SEO Consultation",
        description:
            "Get in touch with Sharik Rasool for SEO strategy and link building services. Free initial consultation for SaaS and tech brands worldwide.",
        images: ["/opengraph-image"],
    },
};

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
            />
            <ContactPageContent />
        </>
    );
}
