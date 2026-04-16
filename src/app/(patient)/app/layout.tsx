import { requireUser } from "@/lib/auth";
import { PatientSidebar } from "@/components/app/patient-sidebar";

export default async function PatientAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser("patient");
  return (
    <div className="flex min-h-screen">
      <PatientSidebar user={user} />
      <div className="flex min-h-screen flex-1 flex-col">
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
