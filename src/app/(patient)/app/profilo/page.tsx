import {
  AlertTriangle,
  Download,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Profilo" };

export default async function ProfiloPage() {
  const user = await requireUser("patient");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profilo</h1>
        <p className="text-muted-foreground">
          I dati che ci hai dato tu. Puoi aggiornarli o cancellarli quando
          vuoi.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Dati personali</CardTitle>
          <CardDescription>
            Nome e contatti. Usati solo per ricordarti le sedute.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} email={user.email} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>
            Accedi con magic link, quindi al momento non serve una password.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <CardTitle className="text-base">
                I tuoi dati, i tuoi diritti
              </CardTitle>
              <CardDescription>
                GDPR art. 15-21 · puoi esportare o cancellare tutto.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" disabled>
            <Download className="mr-1 h-4 w-4" />
            Esporta i miei dati (JSON)
          </Button>
          <Button variant="outline" disabled>
            Chiedi rettifica
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <CardTitle className="text-base">Area pericolosa</CardTitle>
              <CardDescription>
                Eliminazione account. Non può essere annullata.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Se elimini l&apos;account, i tuoi dati clinici vengono anonimizzati
            entro 30 giorni. I dati fiscali dei pagamenti restano per 10 anni
            come richiesto per legge.
          </p>
          <Button variant="destructive" className="mt-4" disabled>
            <Trash2 className="mr-1 h-4 w-4" />
            Elimina account (in sviluppo)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
