import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Lock,
  ShieldCheck,
  Video,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser, displayName } from "@/lib/auth";
import { getTherapistBySlug, formatCurrency } from "@/lib/queries";
import { CalEmbed } from "@/components/app/cal-embed";

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

export default async function TherapistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [t, user] = await Promise.all([
    getTherapistBySlug(slug),
    requireUser("patient"),
  ]);
  if (!t) notFound();

  // Usiamo solo lo username: Cal.com mostra la pagina profilo del sessuologo
  // con tutti gli event types disponibili (il paziente sceglie quello giusto).
  // Se in futuro vogliamo un event type specifico, aggiungiamo un campo
  // `cal_event_slug` sulla tabella therapists.
  const calLink = t.calComUsername || null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/app/prenota"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Torna alla lista
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: bio */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {t.initials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{t.name}</h1>
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

          <div className="space-y-2 rounded-xl border border-border/60 p-4 text-sm">
            <InfoLine icon={GraduationCap} label="Approccio" value={t.approach} />
            {t.experience && (
              <InfoLine icon={Clock} label="Esperienza" value={t.experience} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">Chi sono</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.bio}
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl bg-muted/30 p-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" />
              Su Google Meet, link via email
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Pagamento Stripe, cancellazione gratuita 24h prima
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Dati cifrati, server EU
            </span>
            <span className="mt-1 font-medium text-foreground">
              Prima seduta {formatCurrency(t.pricePerSession)} · 50 min
            </span>
          </div>
        </div>

        {/* Right: Cal.com embed */}
        <Card className="overflow-hidden border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Scegli lo slot</CardTitle>
            <CardDescription>
              Slot live aggiornati in tempo reale dal calendario del sessuologo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {calLink ? (
              <div className="h-[640px] w-full">
                <CalEmbed
                  calLink={calLink}
                  patientEmail={user.email}
                  patientName={displayName(user)}
                  therapistSlug={t.slug}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Il sessuologo non ha ancora collegato la sua agenda Cal.com.
                  Riprova più tardi o scegli un altro specialista.
                </p>
                <Link
                  href="/app/prenota"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Vedi altri specialisti
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-primary" />
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
