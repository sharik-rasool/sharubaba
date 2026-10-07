import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    variable: '--font-space-grotesk',
    display: 'swap',
    preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-plus-jakarta-sans',
    display: 'swap',
    preload: true,
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
    preload: false,
});

const BASE_URL = "https://www.sharikrasool.com";

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    icons: {
        icon: "/monogram-tile-512.png",
        apple: "/monogram-tile-512.png",
    },
    title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
    description:
        "Senior SEO strategist and link builder. Helping SaaS and tech brands scale domain authority and organic rankings through white-hat manual outreach.",
    keywords: ["SEO strategist", "link builder", "SaaS SEO", "organic traffic", "domain authority", "backlinks"],
    authors: [{ name: "Sharik Rasool", url: BASE_URL }],
    creator: "Sharik Rasool",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: BASE_URL,
        siteName: "Sharik Rasool",
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Senior SEO strategist and link builder. Helping SaaS and tech brands scale domain authority and organic rankings through white-hat manual outreach.",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sharik Rasool — SEO Strategist" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sharik Rasool | SEO Strategist & Link Builder for SaaS Brands",
        description:
            "Senior SEO strategist and link builder. Helping SaaS and tech brands scale domain authority and organic rankings through white-hat manual outreach.",
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: BASE_URL },
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sharik Rasool",
    "jobTitle": "Senior SEO Strategist & Link Building Specialist",
    "url": BASE_URL,
    "image": `${BASE_URL}/assets/sharik-portrait-2.jpeg`,
    "description": "Senior SEO strategist and manual outreach link builder with 8+ years experience scaling organic search rankings and domain rating for SaaS and tech brands.",
    "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Jain University",
        "description": "MBA in Digital Marketing"
    },
    "sameAs": [
        "https://www.linkedin.com/in/sharik-rasool-074155174/",
        "https://www.instagram.com/growithsharik"
    ],
    "knowsAbout": [
        "Search Engine Optimization (SEO)",
        "Link Building & Manual Outreach",
        "Technical SEO Audits",
        "SaaS Organic Traffic Strategy",
        "Digital PR",
        "Core Web Vitals Optimization",
        "Ahrefs & Semrush Analysis"
    ]
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isPathAdmin = false; // We will use route groups instead for better isolation

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            </head>
            <body className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased font-sans bg-background text-foreground`} suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
