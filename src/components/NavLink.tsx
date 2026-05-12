"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface NavLinkProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> {
  className?: string | ((props: { isActive: boolean }) => string);
  activeClassName?: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    const computedClassName = typeof className === "function"
      ? className({ isActive })
      : cn(className, isActive && activeClassName);

    return (
      <Link
        ref={ref}
        href={href}
        className={computedClassName}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";
