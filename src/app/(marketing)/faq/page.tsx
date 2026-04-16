import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Domande frequenti",
  description:
    "Tutte le risposte: privacy, pagamenti, fatturazione, cambio sessuologo, emergenze.",
};

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Privacy e riservatezza",
    items: [
      {
        q: "È davvero riservato?",
        a: "Sì. I dati clinici sono cifrati, vivono su server in Europa (Francoforte) e non appaiono mai nelle email di conferma. Solo tu e il tuo sessuologo accedete ai contenuti delle sedute.",
      },
      {
        q: "Chi vede le mie risposte al questionario?",
        a: "Solo te e il sessuologo che scegli. Non condividiamo i dati con terzi per marketing, non li usiamo per allenare modelli AI, non li cediamo.",
      },
      {
        q: "Cosa succede se elimino il mio account?",
        a: "I tuoi dati personali vengono anonimizzati entro 30 giorni. Conserviamo solo i dati fiscali dei pagamenti, come richiesto per legge (10 anni).",
      },
    ],
  },
  {
    title: "Prenotazione e sedute",
    items: [
      {
        q: "Quanto dura una seduta?",
        a: "50 minuti in videochiamata Google Meet. Ti arriva il link via email qualche minuto prima dell’orario.",
      },
      {
        q: "Posso cancellare o spostare una seduta?",
        a: "Sì, gratuitamente fino a 24 ore prima. Oltre quel limite il sessuologo può trattenere la tariffa, come in uno studio tradizionale.",
      },
      {
        q: "Posso cambiare sessuologo?",
        a: "Quando vuoi. Dalla tua area riservata scegli un altro specialista e riparti dalla prossima seduta. Non serve spiegare perché.",
      },
      {
        q: "Posso fare sedute di coppia?",
        a: "Sì. Prenoti per te e decidi chi ti accompagna. Il sessuologo ti dirà se preferisce sedute separate o congiunte in base al tema.",
      },
    ],
  },
  {
    title: "Pagamenti e fatture",
    items: [
      {
        q: "Come pago?",
        a: "Carta di credito/debito via Stripe, il sistema di pagamento che usano aziende come Apple e Booking. Non salviamo mai i dati della tua carta.",
      },
      {
        q: "Posso detrarre le sedute?",
        a: "Le prestazioni sanitarie svolte da sessuologi con i requisiti previsti sono detraibili al 19 %. Ogni fattura è nominale e scaricabile dalla tua area.",
      },
      {
        q: "Esistono pacchetti scontati?",
        a: "No, e non vogliamo introdurli. Il pay-per-session è una scelta etica: non ti leghiamo a un percorso che magari non ti serve.",
      },
    ],
  },
  {
    title: "Emergenze e limiti",
    items: [
      {
        q: "Sessualmente è un servizio medico?",
        a: "No. Offriamo consulenza sessuologica online con professionisti qualificati. Non prescriviamo farmaci e non siamo un servizio di emergenza.",
      },
      {
        q: "Cosa faccio se sto male ora?",
        a: "Se stai vivendo un’emergenza, contatta il 118 o il Telefono Amico (02 2327 2327). Per situazioni di rischio psicologico, il numero dedicato è 0223272327.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Domande frequenti
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
          Se ti stai chiedendo qualcosa, probabilmente c’è la risposta qui.
        </h1>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xl font-medium text-primary">
                {group.title}
              </h2>
              <dl className="mt-6 space-y-4">
                {group.items.map(({ q, a }) => (
                  <div
                    key={q}
                    className="rounded-xl border bg-background p-6"
                  >
                    <dt className="text-lg font-medium">{q}</dt>
                    <dd className="mt-2 text-sm text-muted-foreground">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 p-10 text-center">
          <h3 className="text-2xl font-medium">
            Non hai trovato quello che cercavi?
          </h3>
          <p className="max-w-md text-muted-foreground">
            Scrivici a{" "}
            <a
              href="mailto:aiuto@sessualmente.it"
              className="underline underline-offset-4"
            >
              aiuto@sessualmente.it
            </a>
            . Rispondiamo entro 24 ore lavorative.
          </p>
          <Link
            href="/questionario"
            className={buttonVariants({ variant: "outline" })}
          >
            Inizia il questionario
          </Link>
        </div>
      </section>
    </>
  );
}
