"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitApplication } from "./actions";

export function CandidaturaForm() {
  const [state, formAction, pending] = useActionState(submitApplication, null);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state]);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Candidatura ricevuta
        </h2>
        <p className="max-w-md text-muted-foreground">
          Grazie! Leggiamo ogni candidatura personalmente. Ti rispondiamo entro
          5 giorni lavorativi all&apos;email che ci hai indicato.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field id="firstName" label="Nome" required />
      <Field id="lastName" label="Cognome" required />
      <Field id="email" label="Email" type="email" required />
      <Field id="phone" label="Telefono" type="tel" />

      <div className="sm:col-span-2">
        <Label htmlFor="qualification">Qualifica professionale</Label>
        <Input
          id="qualification"
          name="qualification"
          placeholder="Es. Psicoterapeuta + Master in sessuologia clinica (CIS 2017)"
          className="mt-2"
          required
        />
      </div>

      <Field
        id="albo"
        label="Ordine di appartenenza e n° iscrizione"
        placeholder="Es. OPL 03/12345"
        required
      />
      <Field
        id="years"
        label="Anni di pratica"
        type="number"
        placeholder="5"
        required
      />

      <div className="sm:col-span-2">
        <Label htmlFor="approach">Approccio e specializzazioni</Label>
        <Textarea
          id="approach"
          name="approach"
          rows={4}
          placeholder="In 3-4 righe: che approccio porti e con quali temi ti trovi più a tuo agio."
          className="mt-2"
          required
        />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="motivation">
          Perché vuoi lavorare con Sessualmente
        </Label>
        <Textarea
          id="motivation"
          name="motivation"
          rows={4}
          placeholder="Facoltativo — ma ci aiuta a capirti meglio."
          className="mt-2"
        />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="cv" className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-muted-foreground" />
          Carica il CV (PDF, max 5MB) — upload attivato presto
        </Label>
        <Input id="cv" type="file" accept=".pdf" className="mt-2" disabled />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs sm:col-span-2">
        <Checkbox className="mt-0.5" name="consent" required />
        <span className="leading-snug text-muted-foreground">
          Accetto il trattamento dei dati per finalità di valutazione della
          candidatura (
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          ).
        </span>
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Invio..." : "Invia candidatura"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
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
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
