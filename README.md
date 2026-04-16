# Sessualmente

Piattaforma di sessuologia online — MVP per validare la domanda pazienti in 8-12 settimane.

> Riferimenti ispirazione: Unobravo, Serenis. Qui il focus è verticale sulla sessuologia.

## Stack

- **Next.js 16** (App Router) + TypeScript + Turbopack
- **Tailwind CSS v4** + **shadcn/ui** (neutral) + Base UI
- **Supabase** (EU Frankfurt) — Postgres, Auth, Storage, RLS
- **Stripe** — pay-per-session
- **Resend** — email transazionali
- **Cal.com** + **Google Meet** — booking + video
- **Vercel** (EU Frankfurt) — hosting
- **PostHog EU** + **Plausible** — analytics
- **Sentry** — error tracking

Piano completo in `/Users/manfreditocci/.claude/plans/squishy-knitting-hopper.md`.

## Struttura route

```
src/app/
  (marketing)/          # Sito vetrina pubblico (SSG/ISR)
    page.tsx            # Home
    come-funziona/      # TODO Sprint 1
    prezzi/             # TODO Sprint 1
    specialisti/        # TODO Sprint 2
    lavora-con-noi/     # Recruitment professionisti
    privacy, termini, cookie/  # Legali (placeholder)
  (auth)/
    accedi/             # Magic link login
    callback/           # Supabase OAuth callback
  (patient)/app/        # Area paziente autenticata (sidebar)
    dashboard/
    questionario/       # Intake 10 domande (Sprint 1)
    prenota/            # Cal.com + Stripe (Sprint 2)
    sedute, fatture, profilo/
  (pro)/pro/            # Area sessuologo autenticata (sidebar)
    dashboard/
    agenda, pazienti, incassi, profilo/
  api/
    stripe/webhook/     # Conferma pagamento
    cal/webhook/        # Booking → meet_url
```

## Setup locale

1. **Node 22+** richiesto.
2. Copia `.env.example` in `.env.local` e compila i valori (Supabase, Stripe, Resend, Cal.com).
3. Installa le dipendenze:
   ```bash
   npm install
   ```
4. Avvia il dev server:
   ```bash
   npm run dev
   ```
   Apri [http://localhost:3000](http://localhost:3000).

## Comandi

| Comando | Descrizione |
|---|---|
| `npm run dev` | Dev server (Turbopack, hot reload) |
| `npm run build` | Build di produzione |
| `npm start` | Avvia il build di produzione |
| `npm run lint` | ESLint |

## Convenzioni

- **Route groups** `(marketing)` `(auth)` `(patient)` `(pro)` per layout diversi nello stesso progetto.
- Supabase client: `@/lib/supabase/server` (Server Components + Server Actions), `@/lib/supabase/client` (Client Components), middleware refresh in `src/middleware.ts`.
- Helper auth: `@/lib/auth` → `requireUser()` / `getUser()`. Estendere con `requireRole()` in Sprint 1.
- Bottoni-link: usare `buttonVariants()` + `<Link>` (shadcn v4 ha rimosso `asChild`).

## Compliance (WIP)

- Hosting EU su tutti i subprocessor.
- RLS Supabase obbligatorio su tabelle con dati personali.
- Nessun dato clinico in chiaro nelle email.
- DPIA + legal review prima del go-live.
