"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { List } from "lucide-react";

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        const elements = document.querySelectorAll("h2, h3");
        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (!toc || toc.length === 0) return null;

    return (
        <div className="bg-muted/30 border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <List className="h-5 w-5" />
                Table of Contents
            </h3>
            <nav className="text-sm">
                <ul className="space-y-3">
                    {toc.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`block transition-colors hover:text-primary ${
                                    activeId === item.id ? "text-primary font-medium" : "text-muted-foreground"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {item.text}
                            </a>
                            {item.children && item.children.length > 0 && (
                                <ul className="pl-4 mt-2 space-y-2 border-l border-border/50 ml-1">
                                    {item.children.map((child) => (
                                        <li key={child.id}>
                                            <a
                                                href={`#${child.id}`}
                                                className={`block transition-colors hover:text-primary ${
                                                    activeId === child.id ? "text-primary font-medium" : "text-muted-foreground"
                                                }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(child.id)?.scrollIntoView({ behavior: "smooth" });
                                                }}
                                            >
                                                {child.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
