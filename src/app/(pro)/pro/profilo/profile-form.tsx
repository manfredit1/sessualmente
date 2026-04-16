"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ExternalLink, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { EducationItem, StyleProfile } from "@/lib/queries";
import { updateProProfile } from "./actions";

export function ProProfileForm({
  initial,
}: {
  initial: {
    bio: string;
    role: string;
    approach: string;
    tags: string[];
    calComUsername: string | null;
    iban: string | null;
    codiceFiscale: string | null;
    partitaIva: string | null;
    email: string;
    age: number | null;
    region: string | null;
    orientation: string | null;
    selfDescription: string | null;
    styleProfile: StyleProfile | null;
    education: EducationItem[] | null;
    courses: string[] | null;
  };
}) {
  const [state, formAction, pending] = useActionState(updateProProfile, null);

  useEffect(() => {
    if (state?.success) toast.success("Profilo aggiornato");
    if (state?.error) toast.error(state.error);
  }, [state]);

  const educationText = (initial.education ?? [])
    .map((e) => `${e.type}|${e.description}`)
    .join("\n");
  const coursesText = (initial.courses ?? []).join("\n");

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <FormSection
        title="Bio breve"
        description="50-300 caratteri. È quella che il paziente vede nelle card di scelta."
      >
        <Textarea
          name="bio"
          rows={4}
          defaultValue={initial.bio}
          placeholder="Scrivi qui la tua bio breve..."
        />
      </FormSection>

      <FormSection
        title="Come ti descrivi"
        description="Self-presentation estesa (200-500 parole). Appare nella pagina di dettaglio del tuo profilo."
      >
        <Textarea
          name="selfDescription"
          rows={8}
          defaultValue={initial.selfDescription ?? ""}
          placeholder="Dopo la laurea in... Il mio approccio è..."
        />
      </FormSection>

      <FormSection title="Chi sei">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="role"
            label="Titolo professionale"
            defaultValue={initial.role}
          />
          <Field
            id="approach"
            label="Approccio (breve)"
            defaultValue={initial.approach}
          />
          <Field
            id="orientation"
            label="Orientamento teorico"
            defaultValue={initial.orientation ?? ""}
            placeholder="Cognitivo-Comportamentale, Sistemico, Gestalt..."
          />
          <Field
            id="age"
            label="Età"
            type="number"
            defaultValue={initial.age ? String(initial.age) : ""}
          />
          <Field
            id="region"
            label="Regione"
            defaultValue={initial.region ?? ""}
            placeholder="Lombardia, Lazio, Calabria..."
          />
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
            I tag sono gestiti dall&apos;admin durante l&apos;onboarding per
            garantire coerenza. Chiedici di aggiungerne o rimuoverne.
          </p>
        </div>
      </FormSection>

      <FormSection
        title="Il tuo stile in seduta"
        description="Aiuta il paziente a capire se ti trova congeniale prima ancora di parlarti. 4 slider da 0 a 100."
      >
        <div className="space-y-6">
          <SliderField
            name="style_fi"
            label="Tono"
            leftLabel="formale"
            rightLabel="informale"
            defaultValue={initial.styleProfile?.formale_informale ?? 50}
          />
          <SliderField
            name="style_rr"
            label="Approccio"
            leftLabel="riflessivo"
            rightLabel="razionale"
            defaultValue={initial.styleProfile?.riflessivo_razionale ?? 50}
          />
          <SliderField
            name="style_ss"
            label="Struttura della seduta"
            leftLabel="spazio libero"
            rightLabel="scaletta definita"
            defaultValue={initial.styleProfile?.spazio_scaletta ?? 50}
          />
          <SliderField
            name="style_lg"
            label="Conduzione"
            leftLabel="lascia l'iniziativa"
            rightLabel="guida la conversazione"
            defaultValue={initial.styleProfile?.lascia_guida ?? 50}
          />
        </div>
      </FormSection>

      <FormSection
        title="Formazione"
        description="Una voce per riga, formato: tipo|descrizione. Tipo: albo, laurea, specializzazione, esperienza."
      >
        <Textarea
          name="education"
          rows={6}
          defaultValue={educationText}
          placeholder={`albo|Ordine Psicologi del Lazio — n. 19556
laurea|Laurea in Psicologia Clinica — Sapienza di Roma (2011)
specializzazione|Specializzazione in Sessuologia Clinica — CIS Roma (2014)
esperienza|8 anni di pratica clinica privata`}
          className="font-mono text-xs"
        />
      </FormSection>

      <FormSection
        title="Corsi e aggiornamenti"
        description="Una voce per riga, solo il nome del corso."
      >
        <Textarea
          name="courses"
          rows={4}
          defaultValue={coursesText}
          placeholder={`Sessuologia di coppia in terapia — CIS 2024
Trauma e sessualità — SITCC 2022`}
        />
      </FormSection>

      <FormSection
        title="Agenda Cal.com"
        description="Il path pubblico del tuo calendario (es. giulia-bianchi/30min)."
      >
        <Field
          id="calComUsername"
          label="Cal path"
          defaultValue={initial.calComUsername ?? ""}
        />
        {initial.calComUsername && (
          <a
            href={`https://cal.com/${initial.calComUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Apri su Cal.com
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </FormSection>

      <FormSection
        title="Dati per fattura"
        description="Servono per fatturare al paziente e per i bonifici."
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

      <div className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/30 p-4 text-xs text-muted-foreground">
        <Lightbulb className="h-4 w-4 flex-none text-primary" />
        Le modifiche sono visibili in pochi secondi sulla tua scheda pubblica
        (pagina &ldquo;Specialisti&rdquo; e &ldquo;Prenota&rdquo;).
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} size="lg">
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
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}

function SliderField({
  name,
  label,
  leftLabel,
  rightLabel,
  defaultValue,
}: {
  name: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  defaultValue: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type="range"
        min={0}
        max={100}
        step={5}
        defaultValue={defaultValue}
        className="mt-3 w-full accent-primary"
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
