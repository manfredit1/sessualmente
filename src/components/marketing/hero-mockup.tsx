import {
  CheckCircle2,
  Clock,
  Video,
  CalendarDays,
} from "lucide-react";

/**
 * Composizione di card UI floating per l'hero. Nessuna immagine reale:
 * mostra il prodotto in modo stilizzato (therapist card + prenotazione
 * + next session) su uno sfondo di blob warm.
 */
export function HeroMockup() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl sm:aspect-[5/6]">
      {/* Ambient blobs */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-accent/60 blur-3xl" />

      {/* Card 1: Therapist profile (back card) */}
      <div className="absolute right-0 top-4 w-[78%] rotate-2 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-primary/10 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            GB
          </div>
          <div>
            <p className="text-sm font-semibold">Dott.ssa Giulia Bianchi</p>
            <p className="text-xs text-muted-foreground">
              Sessuologa clinica · 8 anni
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            Coppia
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            Desiderio
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            Conflitto
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5 text-xs">
          <span className="text-muted-foreground">Prima seduta</span>
          <span className="font-semibold">65 €</span>
        </div>
      </div>

      {/* Card 2: Booking confirmation (middle card) */}
      <div className="absolute left-0 top-48 w-[72%] -rotate-3 rounded-2xl border border-border/60 bg-card p-5 shadow-xl shadow-primary/10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <CheckCircle2 className="h-4 w-4" />
          Prenotata
        </div>
        <p className="mt-3 text-sm font-semibold leading-snug">
          Seduta con Giulia Bianchi
        </p>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Martedì 22 aprile · 18:30
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            50 minuti
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-3.5 w-3.5" />
            Google Meet
          </div>
        </div>
      </div>

      {/* Card 3: Next session widget (front card) */}
      <div className="absolute bottom-0 right-4 w-[68%] rotate-1 rounded-2xl border border-border/60 bg-primary p-5 text-primary-foreground shadow-2xl shadow-primary/30">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/70">
          Prossima seduta
        </p>
        <p className="mt-2 text-xl font-semibold">tra 12 minuti</p>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-foreground/10 px-3 py-2.5">
          <span className="text-xs">Dott.ssa Bianchi</span>
          <span className="rounded-full bg-primary-foreground px-3 py-1 text-[11px] font-semibold text-primary">
            Entra
          </span>
        </div>
      </div>
    </div>
  );
}
