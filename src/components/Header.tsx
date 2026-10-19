"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const desktopNav = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Tools", href: "/tools" },
];

const mobileNav = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Link Builder UK", href: "/link-builder-uk", badge: "UK" },
  { name: "SEO Specialist UK", href: "/seo-specialist-uk", badge: "UK" },
  { name: "SEO Audit", href: "/seo-audit", badge: "$15" },
  { name: "Projects", href: "/projects" },
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
          <Link
            href="/about"
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-all rounded-lg inline-flex items-center gap-1.5",
              pathname === "/about"
                ? "text-primary bg-primary/10 font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>

          {/* Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-all rounded-lg inline-flex items-center gap-1 outline-none",
                pathname === "/link-builder-uk" || pathname === "/seo-specialist-uk" || pathname === "/seo-audit"
                  ? "text-primary bg-primary/10 font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              )}
            >
              <span>Services</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 shadow-xl border border-border bg-popover/95 backdrop-blur-md">
              <DropdownMenuItem asChild>
                <Link
                  href="/link-builder-uk"
                  className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer hover:bg-muted focus:bg-muted transition-colors w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm text-foreground">Link Builder UK</span>
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-primary/15 text-primary border border-primary/25">DR50+</span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-normal">
                    White-hat manual outreach &amp; editorial placements
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/seo-specialist-uk"
                  className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer hover:bg-muted focus:bg-muted transition-colors w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm text-foreground">SEO Specialist UK</span>
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">Strategy</span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-normal">
                    Technical audits, keyword clusters &amp; search revenue
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/seo-audit"
                  className="flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer hover:bg-muted focus:bg-muted transition-colors w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm text-foreground">Custom SEO Teardown</span>
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-primary/20 text-primary font-black border border-primary/30">$15</span>
                  </div>
                  <span className="text-xs text-muted-foreground leading-normal">
                    Detailed competitor link gap &amp; actionable video
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {desktopNav.filter((item) => item.name !== "About").map((item) => (
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
            </Link>
          ))}
        </div>

        {/* Crawlable Semantic Links for Search Engine Bots */}
        <div className="sr-only" aria-hidden="true">
          <Link href="/link-builder-uk">Freelance Link Builder in UK</Link>
          <Link href="/seo-specialist-uk">SEO Specialist in UK</Link>
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
