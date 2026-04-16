import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { WelcomeForm } from "./welcome-form";

export const metadata = {
  title: "Benvenuto",
  robots: { index: false },
};

export default async function BenvenutoPage() {
  const user = await requireUser("patient");

  // Se l'utente ha già completato l'onboarding, salta questa pagina.
  if (user.firstName && user.lastName) {
    redirect("/app/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Benvenuto
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Come ti chiami?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Ci servono due dati per personalizzare la tua area. Li vede solo il
          sessuologo con cui ti confronti — nessuno scambio con terzi.
        </p>

        <div className="mt-8">
          <WelcomeForm />
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Potrai cambiarli in qualsiasi momento dal tuo profilo.
        </p>
      </div>
    </div>
  );
}
