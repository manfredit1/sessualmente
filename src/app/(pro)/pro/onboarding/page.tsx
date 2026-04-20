import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProTherapist, isOnboarded } from "@/lib/pro-guard";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata = { title: "Setup profilo" };

export default async function OnboardingPage() {
  const user = await requireUser("pro");
  const therapist = await getProTherapist(user.id);

  if (!therapist) redirect("/");
  if (isOnboarded(therapist)) redirect("/pro/dashboard");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10 sm:px-6">
      <OnboardingWizard
        therapistName={therapist.name}
        calUsername={therapist.cal_com_username ?? ""}
        initial={{
          bio:
            therapist.bio && therapist.bio !== "Profilo in completamento."
              ? therapist.bio
              : "",
          tags: therapist.tags ?? [],
          iban: therapist.iban ?? "",
          codiceFiscale: therapist.codice_fiscale ?? "",
          partitaIva: therapist.partita_iva ?? "",
        }}
      />
    </div>
  );
}
