import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  GraduationCap,
  Languages,
  Lock,
  ShieldCheck,
  Video,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTherapistBySlug, formatCurrency } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTherapistBySlug(slug);
  return {
    title: t ? `Prenota con ${t.name}` : "Specialista",
  };
}

// TODO: sostituire slot mock con l'embed Cal.com reale.
const MOCK_SLOTS = [
  { day: "Lun 20 apr", slots: ["18:00", "19:00"] },
  { day: "Mar 21 apr", slots: ["18:30", "20:00"] },
  { day: "Gio 23 apr", slots: ["18:00", "19:00", "20:00"] },
  { day: "Sab 25 apr", slots: ["10:00", "11:00"] },
];

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTherapistBySlug(slug);
  if (!t) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/app/prenota"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alla lista
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {t.initials}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t.name}
              </h1>
              <p className="text-muted-foreground">{t.role}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <InfoTile icon={GraduationCap} label="Approccio" value={t.approach} />
            {t.experience && (
              <InfoTile icon={Clock} label="Esperienza" value={t.experience} />
            )}
            <InfoTile icon={Languages} label="Lingue" value={t.languages.join(", ")} />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">Chi sono</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.bio}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-8 border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Scegli lo slot</CardTitle>
              <CardDescription>
                Prima seduta da 50 minuti.{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(t.pricePerSession)}
                </span>{" "}
                · paghi dopo aver scelto l&apos;orario.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Slot mock
                </p>
                <p className="mt-1">
                  In produzione qui appare l&apos;embed Cal.com del sessuologo.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {MOCK_SLOTS.map((day) => (
                  <div key={day.day}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {day.day}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {day.slots.map((slot) => (
                        <Link
                          key={slot}
                          href={`/app/prenota/conferma?therapist=${t.slug}&slot=${encodeURIComponent(
                            day.day + " " + slot
                          )}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          {slot}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-col gap-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  Su Google Meet, link via email
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Pagamento via Stripe, cancellazione gratuita 24h prima
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Riservatezza: dati cifrati, server EU
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
