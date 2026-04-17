import { STEPS, type Step } from "@/components/questionario/steps";

function labelFor(step: Step, value: unknown): string {
  if (step.type === "single" || step.type === "multi") {
    const values = Array.isArray(value) ? value : [value];
    const labels = values
      .map((v) => step.options.find((o) => o.value === v)?.label ?? String(v))
      .filter(Boolean);
    return labels.join(" · ");
  }
  if (step.type === "year" || step.type === "text" || step.type === "email") {
    return value === null || value === undefined || value === ""
      ? "—"
      : String(value);
  }
  return String(value);
}

export function IntakeView({
  responses,
}: {
  responses: Record<string, unknown>;
}) {
  const knownKeys = new Set(STEPS.map((s) => s.id));
  const extraKeys = Object.keys(responses).filter((k) => !knownKeys.has(k as never));

  return (
    <div className="space-y-4">
      <dl className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((step) => {
          const value = responses[step.id];
          if (value === undefined) return null;
          return (
            <div key={step.id} className="rounded-md border border-border/50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {step.title}
              </dt>
              <dd className="mt-1 text-sm">{labelFor(step, value)}</dd>
            </div>
          );
        })}
      </dl>
      {extraKeys.length > 0 && (
        <details className="rounded-md border border-border/40 bg-muted/40 p-3 text-xs">
          <summary className="cursor-pointer font-medium text-muted-foreground">
            Altri campi ({extraKeys.length})
          </summary>
          <pre className="mt-2 overflow-x-auto">
            {JSON.stringify(
              Object.fromEntries(extraKeys.map((k) => [k, responses[k]])),
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
}
