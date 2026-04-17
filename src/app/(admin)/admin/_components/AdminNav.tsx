"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Panoramica" },
  { href: "/admin/candidature", label: "Candidature" },
  { href: "/admin/pazienti", label: "Pazienti" },
  { href: "/admin/terapisti", label: "Terapisti" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-border/60 pb-0">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm font-medium transition -mb-px",
              active
                ? "border border-b-background border-border/60 bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
