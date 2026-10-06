"use client";

import { useEffect, useState } from "react";

interface ObfuscatedContactProps {
  type: "email" | "phone";
  className?: string;
}

// Store obfuscated (reversed) email to prevent basic scraping
const REVERSED_EMAIL = "moc.loosarkirahs@ih".split("").reverse().join("");

export function ObfuscatedContact({ type = "email", className }: ObfuscatedContactProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setMounted(true);
    setValue(REVERSED_EMAIL);
  }, [type]);

  if (!mounted) {
    // Return a dummy span during SSR to avoid hydration mismatch,
    // while preventing bots from scraping the real value in static HTML.
    return <span className={className}>[Protected]</span>;
  }

  return (
    <a href={`mailto:${value}`} className={className}>
      {value}
    </a>
  );
}
