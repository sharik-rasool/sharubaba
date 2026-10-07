"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const desktopNav = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "SEO Audit", href: "/seo-audit", badge: "$15" },
  { name: "Blog", href: "/blog" },
  { name: "Tools", href: "/tools" },
];

const mobileNav = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "SEO Audit", href: "/seo-audit", badge: "$15" },
  { name: "Blog", href: "/blog" },
  { name: "Tools", href: "/tools" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-wide flex h-16 items-center justify-between" aria-label="Main navigation">
        {/* Brand Monogram & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 tracking-tight group"
          aria-label="Sharik Rasool - Home"
        >
          <div className="relative h-8 w-8 flex-shrink-0 rounded-lg overflow-hidden border border-border bg-white p-1 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/monogram-tile-512.png"
              alt="Sharik Rasool Logo"
              fill
              priority
              sizes="32px"
              className="object-contain p-0.5"
            />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground lowercase">
            sharik rasool<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1 lg:gap-1.5">
          {desktopNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-all rounded-lg inline-flex items-center gap-1.5",
                pathname === item.href
                  ? "text-primary bg-primary/10 font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-primary/15 text-primary border border-primary/25 leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* CTA Button - Desktop */}
          <Link href="/contact" className="hidden md:block">
            <Button size="sm" className="font-semibold px-4 rounded-xl shadow-sm">
              Get in Touch
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
        >
          <div className="container-wide py-4 space-y-1">
            {mobileNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-xl transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/10 font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-primary/20 text-primary border border-primary/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-3">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full font-bold rounded-xl py-2.5">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
