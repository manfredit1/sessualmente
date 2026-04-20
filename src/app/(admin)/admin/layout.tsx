import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";
import { requireUser, displayName } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { AdminNav } from "./_components/AdminNav";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("admin");

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Admin · Sessualmente
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-xs text-muted-foreground sm:block">
              {displayName(user)} · {user.email}
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                title="Esci"
                aria-label="Esci"
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Esci</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <AdminNav />
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
