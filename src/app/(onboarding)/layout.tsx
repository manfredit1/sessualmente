import Link from "next/link";
import { Lock } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            sessualmente<span className="text-primary">.</span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Dati cifrati · server EU
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        Le risposte sono cifrate. Non le condividiamo con nessuno.
      </footer>
    </div>
  );
}
