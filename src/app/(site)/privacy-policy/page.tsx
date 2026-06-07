import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Data Protection & Privacy Rights | Sharik Rasool",
    description:
        "Read the official privacy policy for Sharik Rasool's website and SEO services. Learn how we collect, protect, and use your personal information and cookies.",
    alternates: { canonical: "https://www.sharikrasool.com/privacy-policy" },
    robots: {
        index: false,
    },
};

export default function PrivacyPolicyPage() {
    return (
        <section className="section">
            <div className="container-narrow prose-custom">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-muted-foreground mb-6">Last updated: January 2024</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We collect information you provide directly, including name, email, and message content when you use our contact form.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use collected information to respond to inquiries, provide services, and improve our website experience.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
                <p className="text-muted-foreground mb-4">We implement appropriate security measures to protect your personal information.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
                <p className="text-muted-foreground">For privacy concerns, contact us at hi@sharikrasool.com.</p>
            </div>
        </section>
    );
}
