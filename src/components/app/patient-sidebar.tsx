"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  FileText,
  Home,
  LogOut,
  ReceiptText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(auth)/actions";
import type { CurrentUser } from "@/lib/user";
import { displayName, initialsOf } from "@/lib/user";

const items = [
  { href: "/app/dashboard", label: "Home", icon: Home },
  { href: "/app/sedute", label: "Le mie sedute", icon: CalendarClock },
  { href: "/app/prenota", label: "Prenota", icon: FileText },
  { href: "/app/fatture", label: "Fatture", icon: ReceiptText },
  { href: "/app/profilo", label: "Profilo", icon: User },
];

export function PatientSidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  const initials = initialsOf(user);
  const name = displayName(user);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-sidebar md:block">
      <div className="sticky top-0 flex h-screen flex-col p-4">
        <Link href="/" className="px-2 text-xl font-semibold tracking-tight">
          sessualmente<span className="text-primary">.</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-0.5 text-sm">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-border/60 bg-background p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                title="Esci"
                aria-label="Esci"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
