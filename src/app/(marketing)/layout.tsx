import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/specialisti", label: "Specialisti" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/faq", label: "FAQ" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-medium tracking-tight"
          >
            sessualmente<span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/accedi"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Accedi
            </Link>
            <Link
              href="/questionario"
              className={buttonVariants({ size: "sm" })}
            >
              Inizia ora
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="text-xl font-medium tracking-tight"
              >
                sessualmente<span className="text-primary">.</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Sessuologia online con sessuologi qualificati.
                Parlane in totale riservatezza, da casa tua.
              </p>
              <p className="mt-6 text-xs text-muted-foreground">
                Non è un servizio di emergenza. In caso di urgenza chiama il
                118 o il Telefono Amico (02 2327 2327).
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Piattaforma
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/come-funziona"
                    className="hover:text-foreground"
                  >
                    Come funziona
                  </Link>
                </li>
                <li>
                  <Link href="/specialisti" className="hover:text-foreground">
                    Specialisti
                  </Link>
                </li>
                <li>
                  <Link href="/prezzi" className="hover:text-foreground">
                    Prezzi
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Legale
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/lavora-con-noi"
                    className="hover:text-foreground"
                  >
                    Lavora con noi
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/termini" className="hover:text-foreground">
                    Termini e condizioni
                  </Link>
                </li>
                <li>
                  <Link href="/cookie" className="hover:text-foreground">
                    Cookie policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} Sessualmente. Tutti i diritti
              riservati.
            </p>
            <p>Piattaforma in fase di validazione · server EU</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
