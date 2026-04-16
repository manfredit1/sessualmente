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
    .select("name, role, slug")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen">
      <ProSidebar
        user={user}
        therapistName={therapist?.name ?? null}
        therapistRole={therapist?.role ?? null}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
