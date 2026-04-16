"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeWelcome } from "./actions";

export function WelcomeForm() {
  const [state, formAction, pending] = useActionState(completeWelcome, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="Nome" required autoFocus />
        <Field id="lastName" label="Cognome" required />
        <Field id="phone" label="Telefono (opzionale)" type="tel" />
        <Field id="city" label="Città (opzionale)" />
        <Field
          id="birthYear"
          label="Anno di nascita"
          type="number"
          placeholder="1990"
          hint="Serve solo per adattare i contenuti"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Salvataggio..." : "Continua"}
        {!pending && <ArrowRight className="ml-1 h-4 w-4" />}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  autoFocus,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
