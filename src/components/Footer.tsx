import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin, Instagram, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { ObfuscatedContact } from "./ObfuscatedContact";

const footerLinks = {
  main: [
    { name: "Home", href: "/" },
    { name: "About Sharik", href: "/about" },
    { name: "Client Case Studies", href: "/projects" },
    { name: "SEO & Growth Blog", href: "/blog" },
    { name: "Contact & Inquiries", href: "/contact" },
    { name: "Book Strategy Call", href: "https://calendly.com/sharikkashmiri", external: true },
  ],
  services: [
    { name: "Custom SEO Audit ($15)", href: "/seo-audit", badge: "New" },
    { name: "Link Builder in UK", href: "/link-builder-uk" },
    { name: "SEO Specialist in UK", href: "/seo-specialist-uk" },
    { name: "SaaS Link Building Sprints", href: "/projects" },
    { name: "Competitor Link Gap Analysis", href: "/seo-audit" },
    { name: "Free Strategy Consultation", href: "https://calendly.com/sharikkashmiri", external: true },
  ],
  tools: [
    { name: "Website Authority Checker", href: "/tools/website-authority-checker", badge: "Popular" },
    { name: "All 10+ Free SEO Tools", href: "/tools" },
    { name: "Artist Name Generator", href: "/tools/artist-name-generator" },
    { name: "IEEE Citation Generator", href: "/tools/ieee-citation-generator" },
    { name: "Japanese Name Generator", href: "/tools/japanese-name-generator" },
    { name: "Random NFL Team Generator", href: "/tools/random-nfl-team-generator" },
    { name: "Random College Generator", href: "/tools/random-college-generator" },
    { name: "Square Face Generator", href: "/tools/square-face-generator" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sharik-rasool-074155174/", icon: Linkedin },
  { name: "Instagram", href: "https://www.instagram.com/growithsharik", icon: Instagram },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm" role="contentinfo">
      {/* Top CTA Banner in Footer */}
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/5 via-background to-primary/5 py-8">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to scale your organic search traffic?
            </div>
            <p className="text-base sm:text-lg font-bold text-foreground">
              Get an actionable $15 SEO Teardown or schedule a 1-on-1 strategy call.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link href="/seo-audit">
              <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5">
                <span>Order $15 Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <a 
              href="https://calendly.com/sharikkashmiri" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-xs sm:text-sm font-semibold transition-colors"
            >
              Book 15-Min Call
            </a>
          </div>
        </div>
      </div>

      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand & Contact (Column 1) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold" aria-label="Sharik Rasool Home">
              <div className="relative h-8 w-8 flex-shrink-0 rounded-lg overflow-hidden border border-border bg-white p-1 shadow-sm flex items-center justify-center">
                <Image
                  src="/monogram-tile-512.png"
                  alt="Sharik Rasool Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="tracking-tight lowercase">
                sharik rasool<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Senior SEO Strategist &amp; Link Builder helping SaaS and tech companies scale domain authority, organic traffic, and customer pipeline through white-hat manual outreach.
            </p>
            <address className="not-italic space-y-2 text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Srinagar, J&amp;K, India (Serving Global &amp; UK Clients)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <ObfuscatedContact type="phone" className="hover:text-foreground transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <ObfuscatedContact type="email" className="hover:text-foreground transition-colors" />
              </div>
            </address>

            <div className="pt-2 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  aria-label={`Follow on ${social.name}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (Column 2) */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Services & Audits (Column 3) */}
          <nav aria-label="Services navigation">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Services &amp; Audits
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-extrabold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Free SEO Tools (Column 4) */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Free SEO Tools
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Sharik Rasool. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refunds</Link>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
