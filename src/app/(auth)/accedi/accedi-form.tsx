"use client";

import { useActionState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink } from "../actions";

export function AccediForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, null);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Controlla la tua email
        </h1>
        <p className="text-sm text-muted-foreground">
          Ti abbiamo inviato il link di accesso a{" "}
          <span className="font-medium text-foreground">{state.email}</span>.
          Può arrivare anche tra qualche secondo.
        </p>
        <p className="text-xs text-muted-foreground">
          Non vedi l&apos;email? Controlla nello spam o{" "}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="underline underline-offset-4 hover:text-foreground"
          >
            riprova
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Accedi</h1>
        <p className="text-sm text-muted-foreground">
          Accesso senza password. Ti inviamo un link via email.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nome@email.it"
          defaultValue={state?.email}
          required
          autoFocus
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        <Mail className="mr-1 h-4 w-4" />
        {pending ? "Invio..." : "Invia link di accesso"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Non hai un account? Funziona lo stesso: lo creiamo al volo con la tua
        email.
      </p>
    </form>
  );
}
