import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
            >
                Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
