import { Clock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ProSidebar } from "@/components/pro/pro-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function ProAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("pro");
  const supabase = await createClient();
  const { data: therapist } = await supabase
    .from("therapists")
    .select("name, role, slug, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const pending = therapist?.status === "pending";

  return (
    <div className="flex min-h-screen">
      <ProSidebar
        user={user}
        therapistName={therapist?.name ?? null}
        therapistRole={therapist?.role ?? null}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        {pending && (
          <div className="border-b border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-none" />
              <div>
                <strong>Profilo in verifica.</strong> Stiamo controllando i tuoi
                dati, ti attiviamo entro 24h. Finché non sei attivo il tuo
                profilo non è visibile ai pazienti.
              </div>
            </div>
          </div>
        )}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
