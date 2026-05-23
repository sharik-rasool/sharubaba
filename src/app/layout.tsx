import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

const BASE_URL = "https://www.sharikrasool.com";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Sharik Rasool | SEO Strategist & Link Builder",
        template: "%s | Sharik Rasool",
    },
    description:
        "Expert SEO strategist and link builder with 6+ years of experience helping SaaS and tech companies grow organically. Boost domain authority and organic traffic.",
    keywords: ["SEO strategist", "link builder", "SaaS SEO", "organic traffic", "domain authority", "backlinks"],
    authors: [{ name: "Sharik Rasool", url: BASE_URL }],
    creator: "Sharik Rasool",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: BASE_URL,
        siteName: "Sharik Rasool",
        title: "Sharik Rasool | SEO Strategist & Link Builder",
        description:
            "Expert SEO strategist and link builder with 6+ years of experience helping SaaS and tech companies grow organically.",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sharik Rasool | SEO Strategist & Link Builder",
        description:
            "Expert SEO strategist and link builder with 6+ years of experience helping SaaS and tech companies grow organically.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: BASE_URL },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isPathAdmin = false; // We will use route groups instead for better isolation

    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased font-sans bg-background text-foreground" suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
