"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ExternalLink, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateProProfile } from "./actions";

export function ProProfileForm({
  initial,
}: {
  initial: {
    bio: string;
    role: string;
    approach: string;
    tags: string[];
    languages: string[];
    calComUsername: string | null;
    iban: string | null;
    codiceFiscale: string | null;
    partitaIva: string | null;
    email: string;
  };
}) {
  const [state, formAction, pending] = useActionState(updateProProfile, null);

  useEffect(() => {
    if (state?.success) toast.success("Profilo aggiornato");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <FormSection
        title="Bio pubblica"
        description="Parla in prima persona. I pazienti apprezzano un tono caldo ma professionale."
      >
        <Textarea
          name="bio"
          rows={6}
          defaultValue={initial.bio}
          placeholder="Scrivi qui la tua bio..."
        />
      </FormSection>

      <FormSection title="Specializzazione e approccio">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="role" label="Titolo professionale" defaultValue={initial.role} />
          <Field id="approach" label="Approccio" defaultValue={initial.approach} />
        </div>
        <div className="mt-4">
          <Label>Tag / aree di intervento</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {initial.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            I tag sono gestiti dall&apos;admin durante l&apos;onboarding.
          </p>
        </div>
        <div className="mt-4">
          <Label>Lingue</Label>
          <div className="mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <Languages className="h-4 w-4 text-muted-foreground" />
            {initial.languages.join(", ")}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Agenda Cal.com"
        description="La tua disponibilità arriva da Cal.com. Puoi gestirla in autonomia."
      >
        <Field
          id="calComUsername"
          label="Username Cal.com (es. giulia-bianchi)"
          defaultValue={initial.calComUsername ?? ""}
        />
        {initial.calComUsername && (
          <a
            href={`https://cal.com/${initial.calComUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Apri Cal.com
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </FormSection>

      <FormSection
        title="Dati per fattura"
        description="Servono per la fatturazione al paziente e per il bonifico mensile."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="codiceFiscale"
            label="Codice fiscale"
            defaultValue={initial.codiceFiscale ?? ""}
          />
          <Field
            id="partitaIva"
            label="Partita IVA"
            defaultValue={initial.partitaIva ?? ""}
          />
          <div className="sm:col-span-2">
            <Field
              id="iban"
              label="IBAN per bonifico"
              defaultValue={initial.iban ?? ""}
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvataggio..." : "Salva modifiche"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  defaultValue,
  type = "text",
}: {
  id: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}
