export type StepId =
  | "soggetto"
  | "tema"
  | "durata"
  | "esperienza"
  | "genere"
  | "orario"
  | "frequenza"
  | "anno_nascita"
  | "note"
  | "email";

export type Option = { value: string; label: string; hint?: string };

type SingleStep = {
  id: StepId;
  type: "single";
  eyebrow: string;
  title: string;
  subtitle?: string;
  options: Option[];
};

type MultiStep = {
  id: StepId;
  type: "multi";
  eyebrow: string;
  title: string;
  subtitle?: string;
  options: Option[];
  min?: number;
  max?: number;
};

type YearStep = {
  id: StepId;
  type: "year";
  eyebrow: string;
  title: string;
  subtitle?: string;
  min: number;
  max: number;
};

type TextStep = {
  id: StepId;
  type: "text";
  eyebrow: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
};

type EmailStep = {
  id: StepId;
  type: "email";
  eyebrow: string;
  title: string;
  subtitle?: string;
  consentLabel: string;
  marketingLabel: string;
};

export type Step =
  | SingleStep
  | MultiStep
  | YearStep
  | TextStep
  | EmailStep;

export const STEPS: Step[] = [
  {
    id: "soggetto",
    type: "single",
    eyebrow: "Cominciamo",
    title: "Chi vuole iniziare un percorso?",
    subtitle:
      "Possiamo proporti sedute individuali, di coppia o esplorative.",
    options: [
      { value: "io", label: "Io, per me" },
      { value: "coppia", label: "Io e il mio partner" },
      {
        value: "terzi",
        label: "Sto valutando per qualcun altro",
        hint: "Va benissimo, il primo passo è informarsi",
      },
    ],
  },
  {
    id: "tema",
    type: "multi",
    eyebrow: "Il tema",
    title: "Quale tema vorresti affrontare per primo?",
    subtitle:
      "Puoi selezionarne più di uno. Li useremo solo per proporti il professionista adatto.",
    min: 1,
    options: [
      { value: "coppia", label: "Dinamiche di coppia, conflitto, comunicazione" },
      { value: "desiderio", label: "Desiderio, intimità, frequenza" },
      { value: "disfunzioni", label: "Disfunzioni sessuali" },
      { value: "identita", label: "Identità, orientamento, genere" },
      { value: "trauma", label: "Esperienze traumatiche" },
      { value: "altro", label: "Qualcosa che non so ancora definire" },
    ],
  },
  {
    id: "durata",
    type: "single",
    eyebrow: "Il contesto",
    title: "Da quanto convivi con questa situazione?",
    options: [
      { value: "breve", label: "Meno di un mese" },
      { value: "medio", label: "Qualche mese" },
      { value: "lungo", label: "Da più di un anno" },
      { value: "incerto", label: "Non saprei definirlo" },
    ],
  },
  {
    id: "esperienza",
    type: "single",
    eyebrow: "Esperienza",
    title: "Hai mai fatto un percorso con un sessuologo o un terapeuta?",
    options: [
      { value: "mai", label: "No, è la prima volta" },
      { value: "in_corso", label: "Sì, lo sto facendo adesso" },
      { value: "completato", label: "Sì, in passato" },
    ],
  },
  {
    id: "genere",
    type: "single",
    eyebrow: "Preferenze",
    title: "Con chi ti troveresti più a tuo agio?",
    subtitle:
      "Alcune persone preferiscono parlarne con un uomo, altre con una donna. Entrambe sono scelte valide.",
    options: [
      { value: "donna", label: "Una donna" },
      { value: "uomo", label: "Un uomo" },
      { value: "indifferente", label: "Non ho preferenze" },
    ],
  },
  {
    id: "orario",
    type: "multi",
    eyebrow: "Quando",
    title: "Quando preferisci fare le sedute?",
    subtitle: "Seleziona tutte le fasce che ti vanno bene.",
    min: 1,
    options: [
      { value: "mattina", label: "Mattina (9-12)" },
      { value: "pomeriggio", label: "Pomeriggio (14-18)" },
      { value: "sera", label: "Sera (18-21)" },
      { value: "weekend", label: "Weekend" },
    ],
  },
  {
    id: "frequenza",
    type: "single",
    eyebrow: "Cadenza",
    title: "Con che frequenza immagini le sedute?",
    subtitle: "Decidi tu, sempre. Puoi sempre cambiare in corsa.",
    options: [
      { value: "settimanale", label: "Settimanale" },
      { value: "bisettimanale", label: "Ogni 15 giorni" },
      { value: "mensile", label: "Una al mese" },
      { value: "flessibile", label: "Preferisco vedere e decidere" },
    ],
  },
  {
    id: "anno_nascita",
    type: "year",
    eyebrow: "Su di te",
    title: "In che anno sei nato/a?",
    subtitle:
      "Ci aiuta a proporti sessuologi con esperienza adatta alla tua fase di vita.",
    min: 1940,
    max: new Date().getFullYear() - 18,
  },
  {
    id: "note",
    type: "text",
    eyebrow: "Ultimo passaggio",
    title: "C'è qualcosa che vuoi farci sapere in anticipo?",
    subtitle:
      "Opzionale. Nessuno leggerà questo testo se non il sessuologo che sceglierai.",
    placeholder: "Scrivi qui (facoltativo)...",
    optional: true,
    maxLength: 500,
  },
  {
    id: "email",
    type: "email",
    eyebrow: "Ci siamo",
    title: "Dove ti inviamo la tua rosa di specialisti?",
    subtitle:
      "Ti mandiamo una email con i professionisti selezionati in base alle tue risposte. Niente newsletter forzate, promesso.",
    consentLabel:
      "Accetto il trattamento dei miei dati, inclusi quelli relativi alla sfera sessuale (GDPR art. 9).",
    marketingLabel:
      "Voglio ricevere ogni tanto consigli e novità da Sessualmente (opzionale).",
  },
];

export type Answers = Partial<{
  soggetto: string;
  tema: string[];
  durata: string;
  esperienza: string;
  genere: string;
  orario: string[];
  frequenza: string;
  anno_nascita: number;
  note: string;
  email: string;
  consent: boolean;
  marketing: boolean;
}>;
