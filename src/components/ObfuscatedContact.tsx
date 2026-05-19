"use client";

import { useEffect, useState } from "react";

interface ObfuscatedContactProps {
  type: "email" | "phone";
  className?: string;
}

// Store obfuscated (reversed) values to prevent basic scraping
const REVERSED_EMAIL = "moc.loosarhs@ih".split("").reverse().join("");
const REVERSED_PHONE = "1490056007 19+".split("").reverse().join(""); // +91 7006500941

export function ObfuscatedContact({ type, className }: ObfuscatedContactProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setMounted(true);
    setValue(type === "email" ? REVERSED_EMAIL : REVERSED_PHONE);
  }, [type]);

  if (!mounted) {
    // Return a dummy span during SSR to avoid hydration mismatch,
    // while preventing bots from scraping the real value in static HTML.
    return <span className={className}>[Protected]</span>;
  }

  if (type === "email") {
    return (
      <a href={`mailto:${value}`} className={className}>
        {value}
      </a>
    );
  }

  return (
    <a href={`tel:${value.replace(/\s+/g, '')}`} className={className}>
      {value}
    </a>
  );
}
