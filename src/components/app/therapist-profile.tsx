import {
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  IdCard,
  Languages as LanguagesIcon,
  Lightbulb,
  MapPin,
  Sparkle,
  UserCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Therapist, EducationItem, StyleProfile } from "@/lib/queries";

/**
 * Componente shared: vista completa di un profilo terapista.
 * Usato sia nella pagina /app/prenota/[slug] sia in future slide-out.
 */
export function TherapistProfile({
  t,
  patientCount,
}: {
  t: Therapist;
  patientCount?: number;
}) {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
          {t.initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t.name}</h1>
          <p className="text-muted-foreground">{t.role}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {t.experience && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {t.experience}
              </Badge>
            )}
            {t.region && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {t.region}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Cosa dovresti sapere */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
          Cosa dovresti sapere
        </h2>
        <div className="mt-3 space-y-2.5 text-sm">
          {t.age && <FactRow icon={UserCircle} text={`Ha ${t.age} anni`} />}
          {t.region && (
            <FactRow icon={MapPin} text={`Vive in ${t.region}`} />
          )}
          {t.experience && (
            <FactRow icon={Clock} text={t.experience} />
          )}
          {patientCount !== undefined && patientCount > 0 && (
            <FactRow
              icon={Users}
              text={`Su Sessualmente ha già seguito ${patientCount} ${patientCount === 1 ? "persona" : "persone"}`}
            />
          )}
          {t.orientation && (
            <FactRow
              icon={GraduationCap}
              text={
                <>
                  È di orientamento{" "}
                  <span className="font-medium text-foreground">
                    {t.orientation}
                  </span>
                </>
              }
            />
          )}
          {t.languages && t.languages.length > 0 && (
            <FactRow
              icon={LanguagesIcon}
              text={`Parla: ${t.languages.join(", ")}`}
            />
          )}
        </div>
      </section>

      {/* Si occupa spesso di */}
      {t.tags.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Si occupa spesso di
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {t.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
              >
                <Sparkle className="h-3 w-3 text-primary" />
                {tag}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Il suo stile (slider) */}
      {t.styleProfile && hasStyleData(t.styleProfile) && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Il suo stile
          </h2>
          <div className="mt-3 space-y-4 text-xs">
            <StyleSlider
              value={t.styleProfile.formale_informale}
              leftLabel="formale"
              rightLabel="informale"
            />
            <StyleSlider
              value={t.styleProfile.riflessivo_razionale}
              leftLabel="riflessivo"
              rightLabel="razionale"
            />
          </div>
          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Durante le sedute
          </h3>
          <div className="mt-3 space-y-4 text-xs">
            <StyleSlider
              value={t.styleProfile.spazio_scaletta}
              leftLabel="spazia liberamente"
              rightLabel="segue una scaletta"
            />
            <StyleSlider
              value={t.styleProfile.lascia_guida}
              leftLabel="lascia l'iniziativa"
              rightLabel="guida la conversazione"
            />
          </div>
        </section>
      )}

      {/* Come si descrive */}
      {t.selfDescription && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Come si descrive
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {t.selfDescription}
          </p>
        </section>
      )}

      {/* Bio breve */}
      {t.bio && !t.selfDescription && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Chi sono
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t.bio}
          </p>
        </section>
      )}

      {/* Formazione */}
      {t.education && t.education.length > 0 && (
        <section className="rounded-xl border border-border/60 bg-muted/20 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Formazione
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            {t.education.map((e, i) => (
              <EducationRow key={i} item={e} />
            ))}
          </ul>
        </section>
      )}

      {/* Corsi */}
      {t.courses && t.courses.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Corsi e aggiornamenti
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {t.courses.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <BookOpen className="mt-0.5 h-4 w-4 flex-none text-primary" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Separator />
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lightbulb className="h-3.5 w-3.5" />
        Tutti i profili sono verificati. Iscrizione all&apos;albo, titolo di
        studio e specializzazione sono controllati da Sessualmente.
      </p>
    </div>
  );
}

function FactRow({
  icon: Icon,
  text,
}: {
  icon: typeof UserCircle;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-muted-foreground">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-primary" />
      <span>{text}</span>
    </div>
  );
}

function StyleSlider({
  value,
  leftLabel,
  rightLabel,
}: {
  value: number | undefined;
  leftLabel: string;
  rightLabel: string;
}) {
  if (value === undefined) return null;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `calc(${clamped}% - 6px)` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
        <span className={clamped < 40 ? "font-medium text-foreground" : ""}>
          {leftLabel}
        </span>
        <span className={clamped > 60 ? "font-medium text-foreground" : ""}>
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

function EducationRow({ item }: { item: EducationItem }) {
  const iconByType: Record<string, typeof IdCard> = {
    albo: IdCard,
    laurea: GraduationCap,
    specializzazione: BookOpen,
    esperienza: Briefcase,
  };
  const Icon = iconByType[item.type] ?? BookOpen;
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-muted-foreground">{item.description}</span>
    </li>
  );
}

function hasStyleData(s: StyleProfile): boolean {
  return (
    s.formale_informale !== undefined ||
    s.riflessivo_razionale !== undefined ||
    s.spazio_scaletta !== undefined ||
    s.lascia_guida !== undefined
  );
}
