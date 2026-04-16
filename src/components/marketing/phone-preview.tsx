import { ChevronRight } from "lucide-react";

/**
 * Mockup "phone-like" che mostra uno step del questionario.
 * Usato nella sezione "come funziona" per rendere il flusso tangibile.
 */
export function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-8 -z-10 rounded-[40px] bg-primary/10 blur-3xl" />
      <div className="overflow-hidden rounded-[36px] border-8 border-foreground/90 bg-background shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 text-[11px] font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            sessualmente
          </span>
          <span>100%</span>
        </div>

        {/* Progress */}
        <div className="px-6 pt-2">
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>Domanda 3 di 10</span>
            <span className="text-primary">30%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[30%] rounded-full bg-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-7">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Il tema
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight">
            Cosa vorresti affrontare per primo?
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Puoi selezionare più di un’area. Le useremo solo per proporti il
            professionista adatto.
          </p>

          <div className="mt-5 space-y-2">
            {[
              { label: "Dinamiche di coppia", active: true },
              { label: "Desiderio e intimità", active: true },
              { label: "Ansia da prestazione", active: false },
              { label: "Identità e orientamento", active: false },
            ].map((opt) => (
              <div
                key={opt.label}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm transition ${
                  opt.active
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border/80 text-muted-foreground"
                }`}
              >
                <span className={opt.active ? "font-medium" : ""}>
                  {opt.label}
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    opt.active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {opt.active && (
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        d="M5 10l3 3 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
            <span>Continua</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
