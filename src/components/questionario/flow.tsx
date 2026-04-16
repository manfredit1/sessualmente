"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { STEPS, type Answers, type Step } from "./steps";
import { submitIntake } from "./actions";

const STORAGE_KEY = "sessualmente.questionario.v1";

export function QuestionarioFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hydrate from sessionStorage on mount (client-only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          stepIndex: number;
          answers: Answers;
        };
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.stepIndex === "number") {
          setStepIndex(Math.min(parsed.stepIndex, STEPS.length - 1));
        }
      }
    } catch {
      // corrupted storage, ignore
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration, to avoid clobbering).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stepIndex, answers })
      );
    } catch {
      // storage full or disabled, ignore
    }
  }, [stepIndex, answers, hydrated]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const canContinue = useMemo(
    () => isStepComplete(step, answers),
    [step, answers]
  );

  function goNext() {
    if (isLast) {
      submit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    const result = await submitIntake(answers);
    if (result?.error) {
      setSubmitting(false);
      alert(result.error);
      return;
    }
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    router.push("/questionario/pronto");
  }

  // Avoid hydration mismatch: render nothing until client has hydrated.
  if (!hydrated) {
    return (
      <div className="mx-auto mt-16 h-48 w-full max-w-xl animate-pulse rounded-2xl bg-card" />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <ProgressBar progress={progress} step={stepIndex + 1} total={STEPS.length} />

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {step.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {step.subtitle}
          </p>
        )}

        <div className="mt-8">
          <StepInput
            step={step}
            answers={answers}
            setAnswers={setAnswers}
            onEnterToAdvance={() => canContinue && goNext()}
          />
        </div>

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Indietro
          </Button>
          <Button
            type="button"
            onClick={goNext}
            disabled={!canContinue || submitting}
          >
            {isLast ? (submitting ? "Invio..." : "Invia") : "Continua"}
            {!isLast && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Le risposte restano nel tuo browser finché non clicchi &quot;Invia&quot;.
      </p>
    </div>
  );
}

function ProgressBar({
  progress,
  step,
  total,
}: {
  progress: number;
  step: number;
  total: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>
          Domanda {step} di {total}
        </span>
        <span className="text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StepInput({
  step,
  answers,
  setAnswers,
  onEnterToAdvance,
}: {
  step: Step;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onEnterToAdvance: () => void;
}) {
  switch (step.type) {
    case "single":
      return (
        <div className="flex flex-col gap-2.5">
          {step.options.map((opt) => {
            const selected = (answers as Record<string, unknown>)[step.id] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setAnswers((a) => ({ ...a, [step.id]: opt.value }))
                }
                className={cn(
                  "flex items-start justify-between gap-3 rounded-xl border p-4 text-left transition",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{opt.label}</span>
                  {opt.hint && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {opt.hint}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                >
                  {selected && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      );

    case "multi": {
      const current = ((answers as Record<string, unknown>)[step.id] as string[] | undefined) ?? [];
      return (
        <div className="flex flex-col gap-2.5">
          {step.options.map((opt) => {
            const selected = current.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = selected
                    ? current.filter((v) => v !== opt.value)
                    : [...current, opt.value];
                  setAnswers((a) => ({ ...a, [step.id]: next }));
                }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm transition",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <span className={selected ? "font-medium" : ""}>
                  {opt.label}
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 flex-none items-center justify-center rounded-md border",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                >
                  {selected && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    case "year": {
      const value = answers.anno_nascita ?? "";
      return (
        <div className="max-w-xs">
          <Label htmlFor="anno_nascita" className="text-sm">
            Anno di nascita
          </Label>
          <Input
            id="anno_nascita"
            type="number"
            inputMode="numeric"
            min={step.min}
            max={step.max}
            placeholder="1990"
            value={value}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setAnswers((a) => ({
                ...a,
                anno_nascita: Number.isFinite(n) ? n : undefined,
              }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEnterToAdvance();
            }}
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Devi avere almeno 18 anni.
          </p>
        </div>
      );
    }

    case "text": {
      const value = answers.note ?? "";
      return (
        <Textarea
          rows={5}
          maxLength={step.maxLength}
          placeholder={step.placeholder}
          value={value}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, note: e.target.value }))
          }
        />
      );
    }

    case "email": {
      return (
        <div className="flex flex-col gap-5">
          <div>
            <Label htmlFor="email" className="text-sm">
              La tua email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@email.it"
              value={answers.email ?? ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, email: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onEnterToAdvance();
              }}
              className="mt-2"
              required
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <Checkbox
              checked={answers.consent ?? false}
              onCheckedChange={(v) =>
                setAnswers((a) => ({ ...a, consent: v === true }))
              }
              className="mt-0.5"
            />
            <span className="leading-snug">{step.consentLabel}</span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={answers.marketing ?? false}
              onCheckedChange={(v) =>
                setAnswers((a) => ({ ...a, marketing: v === true }))
              }
              className="mt-0.5"
            />
            <span className="leading-snug">{step.marketingLabel}</span>
          </label>
        </div>
      );
    }
  }
}

function isStepComplete(step: Step, answers: Answers): boolean {
  switch (step.type) {
    case "single":
      return Boolean((answers as Record<string, unknown>)[step.id]);
    case "multi": {
      const list = ((answers as Record<string, unknown>)[step.id] as string[] | undefined) ?? [];
      const min = step.min ?? 1;
      return list.length >= min;
    }
    case "year": {
      const v = answers.anno_nascita;
      return (
        typeof v === "number" &&
        v >= step.min &&
        v <= step.max
      );
    }
    case "text":
      return step.optional ? true : Boolean((answers.note ?? "").trim());
    case "email": {
      const emailOk = /^\S+@\S+\.\S+$/.test(answers.email ?? "");
      return emailOk && Boolean(answers.consent);
    }
  }
}
