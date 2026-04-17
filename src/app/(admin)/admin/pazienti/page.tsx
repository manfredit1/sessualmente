import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PazientiPage() {
  const supabase = createAdminClient();

  const [{ data: patients }, usersRes, { data: bookings }, { data: intakes }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, first_name, last_name, city, birth_year, created_at")
        .eq("role", "patient")
        .order("created_at", { ascending: false }),
      supabase.auth.admin.listUsers({ perPage: 200 }),
      supabase.from("bookings").select("patient_id, starts_at, status"),
      supabase.from("intake_responses").select("profile_id").not("profile_id", "is", null),
    ]);

  const emailByUserId = new Map(
    (usersRes.data?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  const bookingsByPatient = new Map<string, { total: number; completed: number; last: string | null }>();
  for (const b of bookings ?? []) {
    const entry = bookingsByPatient.get(b.patient_id) ?? {
      total: 0,
      completed: 0,
      last: null,
    };
    entry.total += 1;
    if (b.status === "completed") entry.completed += 1;
    if (!entry.last || b.starts_at > entry.last) entry.last = b.starts_at;
    bookingsByPatient.set(b.patient_id, entry);
  }

  const intakeProfileIds = new Set(
    (intakes ?? []).map((i) => i.profile_id).filter(Boolean) as string[]
  );

  const rows = patients ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Pazienti</h1>
        <p className="text-muted-foreground">
          Elenco dei pazienti registrati sulla piattaforma.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">
            {rows.length === 1
              ? "1 paziente registrato"
              : `${rows.length} pazienti registrati`}
          </CardTitle>
          <CardDescription>
            Visualizzazione sola lettura. Per azioni dirette usa Supabase Studio.
          </CardDescription>
        </CardHeader>
        {rows.length > 0 && (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Città</TableHead>
                  <TableHead>Età</TableHead>
                  <TableHead>Registrato</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead className="text-right">Sedute</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => {
                  const email = emailByUserId.get(p.id) ?? "—";
                  const b = bookingsByPatient.get(p.id);
                  const hasIntake = intakeProfileIds.has(p.id);
                  const fullName =
                    `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() ||
                    "(senza nome)";
                  const age = p.birth_year
                    ? new Date().getFullYear() - p.birth_year
                    : null;

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{fullName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {email}
                      </TableCell>
                      <TableCell>{p.city ?? "—"}</TableCell>
                      <TableCell>{age ? `${age}` : "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {hasIntake ? (
                          <Badge variant="secondary">Compilato</Badge>
                        ) : (
                          <Badge variant="outline">Mancante</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {b ? (
                          <span>
                            {b.completed}/{b.total}
                          </span>
                        ) : (
                          "0"
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/pazienti/${p.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          Dettaglio →
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
