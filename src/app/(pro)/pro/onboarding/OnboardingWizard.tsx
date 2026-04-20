"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { completeOnboarding, type OnboardingPayload } from "./actions";

type FormState = OnboardingPayload;

const STEPS = ["welcome", "identity", "calcom", "fiscal", "review"] as const;
type StepId = (typeof STEPS)[number];

export function OnboardingWizard({
  therapistName,
  calUsername,
  initial,
}: {
  therapistName: string;
  calUsername: string;
  initial: FormState;
}) {
  const router = useRouter();
  const [step, setStep] = useState<StepId>("welcome");
  const [data, setData] = useState<FormState>(initial);
  const [calSetupDone, setCalSetupDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const stepIndex = STEPS.indexOf(step);

  const canProceed = (): string | null => {
    if (step === "identity") {
      if (data.bio.trim().length < 150)
        return "Scrivi almeno 150 caratteri di bio.";
      if (data.tags.length < 1) return "Aggiungi almeno un tag.";
    }
    if (step === "calcom") {
      if (!calSetupDone)
        return "Conferma di aver completato il setup Cal.com.";
    }
    if (step === "fiscal") {
      if (!data.iban.trim()) return "L'IBAN è obbligatorio.";
      if (!data.codiceFiscale.trim() && !data.partitaIva.trim())
        return "Inserisci codice fiscale oppure partita IVA.";
    }
    return null;
  };

  const next = () => {
    const err = canProceed();
    if (err) {
      toast.error(err);
      return;
    }
    setStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)]);
  };

  const back = () => {
    setStep(STEPS[Math.max(stepIndex - 1, 0)]);
  };

  const submit = () => {
    startTransition(async () => {
      const res = await completeOnboarding(data);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Profilo inviato per verifica!");
      router.push("/pro/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Progress current={stepIndex} total={STEPS.length} />

      {step === "welcome" && (
        <WelcomeStep name={therapistName} onNext={next} />
      )}
      {step === "identity" && (
        <IdentityStep data={data} setData={setData} />
      )}
      {step === "calcom" && (
        <CalcomStep
          calUsername={calUsername}
          done={calSetupDone}
          setDone={setCalSetupDone}
        />
      )}
      {step === "fiscal" && <FiscalStep data={data} setData={setData} />}
      {step === "review" && <ReviewStep data={data} calUsername={calUsername} />}

      {step !== "welcome" && (
        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <Button type="button" variant="ghost" onClick={back}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Indietro
          </Button>
          {step === "review" ? (
            <Button type="button" onClick={submit} disabled={isPending} size="lg">
              <Check className="mr-1 h-4 w-4" />
              {isPending ? "Invio..." : "Invia per verifica"}
            </Button>
          ) : (
            <Button type="button" onClick={next} size="lg">
              Continua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / (total - 1)) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Passo {current + 1} di {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WelcomeStep({
  name,
  onNext,
}: {
  name: string;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Benvenuto
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Ciao {name.split(" ")[0]}, completa il tuo profilo
      </h1>
      <p className="text-muted-foreground">
        Ti chiediamo 5 minuti per configurare le informazioni che pazienti e
        amministrazione vedranno. Avrai bisogno di:
      </p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
          Una bio di almeno 150 caratteri
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
          Un account Cal.com (o lo creerai ora in 2 minuti)
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
          Il tuo IBAN e codice fiscale o partita IVA
        </li>
      </ul>
      <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
        Dopo l&apos;invio il tuo profilo passa in revisione. Un nostro admin
        ti attiva entro 24h. Potrai comunque aggiungere foto, formazione e
        corsi dal tuo profilo successivamente.
      </div>
      <Button type="button" onClick={onNext} size="lg" className="self-start">
        Iniziamo
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

function IdentityStep({
  data,
  setData,
}: {
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const tagsInput = data.tags.join(", ");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Passo 1
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Chi sei</h2>
      </div>
      <div>
        <Label htmlFor="bio">Bio breve (min 150 caratteri)</Label>
        <Textarea
          id="bio"
          rows={6}
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          placeholder="Psicologa e sessuologa clinica, lavoro con individui e coppie sulle dinamiche di desiderio, intimità e conflitto. Il mio approccio è..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {data.bio.trim().length} caratteri
        </p>
      </div>
      <div>
        <Label htmlFor="tags">Aree di specializzazione (separa con virgole)</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) =>
            setData({
              ...data,
              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
            })
          }
          placeholder="coppia, desiderio, disfunzioni, identità"
        />
        {data.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalcomStep({
  calUsername,
  done,
  setDone,
}: {
  calUsername: string;
  done: boolean;
  setDone: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Passo 2
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Setup Cal.com
        </h2>
        <p className="mt-1 text-muted-foreground">
          Ti abbiamo già invitato nel team Cal.com di Sessualmente. Bastano 3
          passaggi per essere operativo.
        </p>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-5 text-sm">
        <p className="font-semibold">Cosa fare, nell&apos;ordine:</p>
        <ol className="mt-3 list-inside list-decimal space-y-3 text-muted-foreground">
          <li>
            <strong className="text-foreground">Accetta l&apos;invito Cal.com</strong>{" "}
            che trovi nella tua inbox (mittente: Cal.com, oggetto contiene
            &ldquo;Sessualmente&rdquo;). Al primo ingresso imposti una
            password.
          </li>
          <li>
            <strong className="text-foreground">Collega Google Calendar</strong>{" "}
            →{" "}
            <a
              href="https://app.cal.com/apps/categories/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Apps → Google Calendar → Install
              <ExternalLink className="h-3 w-3" />
            </a>
            . Serve a generare il link Google Meet per ogni seduta.
          </li>
          <li>
            <strong className="text-foreground">Imposta le tue disponibilità</strong>{" "}
            orarie settimanali su{" "}
            <a
              href="https://app.cal.com/availability"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Availability
              <ExternalLink className="h-3 w-3" />
            </a>
            . Scegli gli orari in cui vuoi ricevere pazienti.
          </li>
        </ol>
        <div className="mt-4 rounded-md bg-background p-3 text-xs text-muted-foreground">
          Gli event type (durata 50 min, Google Meet, minimum notice 24h) sono
          già configurati dal team, non devi toccarli.
          {calUsername && (
            <>
              {" "}Il tuo username Cal.com è:{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                cal.com/{calUsername}
              </code>
            </>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-card p-4 text-sm hover:border-primary/40">
        <Checkbox
          checked={done}
          onCheckedChange={(v) => setDone(Boolean(v))}
          className="mt-0.5"
        />
        <span>
          Confermo di aver accettato l&apos;invito Cal.com, collegato Google
          Calendar e impostato le mie disponibilità orarie.
        </span>
      </label>
    </div>
  );
}

function FiscalStep({
  data,
  setData,
}: {
  data: FormState;
  setData: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Passo 3
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Dati fiscali
        </h2>
        <p className="mt-1 text-muted-foreground">
          Servono per fatturare e per pagarti. Dati sensibili, visibili solo
          ad admin.
        </p>
      </div>

      <div>
        <Label htmlFor="iban">IBAN (obbligatorio)</Label>
        <Input
          id="iban"
          value={data.iban}
          onChange={(e) => setData({ ...data, iban: e.target.value })}
          placeholder="IT60 X054 2811 1010 0000 0123 456"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="codiceFiscale">Codice fiscale</Label>
          <Input
            id="codiceFiscale"
            value={data.codiceFiscale}
            onChange={(e) =>
              setData({ ...data, codiceFiscale: e.target.value })
            }
            placeholder="RSSMRA85T10A562S"
          />
        </div>
        <div>
          <Label htmlFor="partitaIva">Partita IVA</Label>
          <Input
            id="partitaIva"
            value={data.partitaIva}
            onChange={(e) => setData({ ...data, partitaIva: e.target.value })}
            placeholder="12345678901"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Uno dei due è obbligatorio. Se hai entrambi, inseriscili entrambi.
      </p>
    </div>
  );
}

function ReviewStep({
  data,
  calUsername,
}: {
  data: FormState;
  calUsername: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Ultimo passo
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Rileggi e invia
        </h2>
        <p className="mt-1 text-muted-foreground">
          Controlla i dati. Dopo l&apos;invio il profilo passa in revisione.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-5 text-sm">
        <ReviewField label="Bio">{data.bio}</ReviewField>
        <ReviewField label="Tags">
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </ReviewField>
        {calUsername && (
          <ReviewField label="Cal.com">
            <code className="rounded bg-background px-1.5 py-0.5 text-xs">
              cal.com/{calUsername}
            </code>
          </ReviewField>
        )}
        <ReviewField label="IBAN">
          <code className="font-mono">{data.iban}</code>
        </ReviewField>
        {data.codiceFiscale && (
          <ReviewField label="Codice fiscale">
            <code className="font-mono">{data.codiceFiscale}</code>
          </ReviewField>
        )}
        {data.partitaIva && (
          <ReviewField label="Partita IVA">
            <code className="font-mono">{data.partitaIva}</code>
          </ReviewField>
        )}
      </div>
    </div>
  );
}

function ReviewField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
