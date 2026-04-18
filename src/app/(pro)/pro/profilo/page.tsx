import { requireOnboardedPro } from "@/lib/pro-guard";
import { getMyTherapistRecord } from "@/lib/queries";
import { ProProfileForm } from "./profile-form";

export const metadata = { title: "Profilo" };

export default async function ProfiloProPage() {
  const { user } = await requireOnboardedPro();
  const therapist = await getMyTherapistRecord(user.id);

  if (!therapist) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Profilo</h1>
        <p className="text-muted-foreground">
          Il tuo account non è ancora collegato a un profilo sessuologo.
          Contatta l&apos;admin per completare l&apos;onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Il tuo profilo</h1>
        <p className="text-muted-foreground">
          Quello che vedono i pazienti quando scelgono con chi parlare.
        </p>
      </div>
      <ProProfileForm
        initial={{
          bio: therapist.bio,
          role: therapist.role,
          approach: therapist.approach,
          tags: therapist.tags,
          calComUsername: therapist.calComUsername,
          iban: therapist.iban,
          codiceFiscale: therapist.codiceFiscale,
          partitaIva: therapist.partitaIva,
          email: user.email,
          age: therapist.age,
          region: therapist.region,
          orientation: therapist.orientation,
          selfDescription: therapist.selfDescription,
          styleProfile: therapist.styleProfile,
          education: therapist.education,
          courses: therapist.courses,
        }}
      />
    </div>
  );
}
