import { createClient } from "@/lib/supabase/server";

// =============================================================================
// Query helpers condivisi tra pagine. Tutti server-only.
// Ritornano tipi "piatti" pensati per l'UI.
// =============================================================================

export type EducationItem = {
  type: "albo" | "laurea" | "specializzazione" | "esperienza" | string;
  description: string;
};

export type StyleProfile = {
  formale_informale?: number; // 0 = formale, 100 = informale
  riflessivo_razionale?: number;
  spazio_scaletta?: number;
  lascia_guida?: number;
};

export type Therapist = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role: string;
  approach: string;
  bio: string;
  tags: string[];
  languages: string[];
  experience: string | null;
  pricePerSession: number; // in cents
  calComUsername: string | null;
  status: "pending" | "active" | "suspended";
  // Rich profile
  age: number | null;
  region: string | null;
  orientation: string | null;
  selfDescription: string | null;
  styleProfile: StyleProfile | null;
  education: EducationItem[] | null;
  courses: string[] | null;
};

export type Booking = {
  id: string;
  patientId: string;
  therapistId: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  meetUrl: string | null;
  amountGross: number;
  amountNet: number;
};

export type Invoice = {
  id: string;
  number: string;
  issuedAt: string;
  amount: number;
  pdfUrl: string | null;
  therapistId: string;
};

// -----------------------------------------------------------------------------

function mapTherapist(row: Record<string, unknown>): Therapist {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    initials: row.initials as string,
    role: row.role as string,
    approach: row.approach as string,
    bio: row.bio as string,
    tags: (row.tags as string[]) ?? [],
    languages: (row.languages as string[]) ?? [],
    experience: (row.experience as string | null) ?? null,
    pricePerSession: (row.price_per_session as number) / 100,
    calComUsername: (row.cal_com_username as string | null) ?? null,
    status: row.status as Therapist["status"],
    age: (row.age as number | null) ?? null,
    region: (row.region as string | null) ?? null,
    orientation: (row.orientation as string | null) ?? null,
    selfDescription: (row.self_description as string | null) ?? null,
    styleProfile: (row.style_profile as StyleProfile | null) ?? null,
    education: (row.education as EducationItem[] | null) ?? null,
    courses: (row.courses as string[] | null) ?? null,
  };
}

function mapBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    patientId: row.patient_id as string,
    therapistId: row.therapist_id as string,
    startsAt: row.starts_at as string,
    endsAt: row.ends_at as string,
    status: row.status as Booking["status"],
    meetUrl: (row.meet_url as string | null) ?? null,
    amountGross: (row.amount_gross as number) / 100,
    amountNet: (row.amount_net as number) / 100,
  };
}

function mapInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    number: row.number as string,
    issuedAt: row.issued_at as string,
    amount: (row.amount as number) / 100,
    pdfUrl: (row.pdf_url as string | null) ?? null,
    therapistId: row.therapist_id as string,
  };
}

// -----------------------------------------------------------------------------

export async function listActiveTherapists(): Promise<Therapist[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select(
      "id, slug, name, initials, role, approach, bio, tags, languages, experience, price_per_session, cal_com_username, status, age, region, orientation, self_description, style_profile, education, courses"
    )
    .eq("status", "active")
    .order("name");
  if (error) throw error;
  return (data ?? []).map(mapTherapist);
}

export async function getTherapistBySlug(slug: string): Promise<Therapist | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select(
      "id, slug, name, initials, role, approach, bio, tags, languages, experience, price_per_session, cal_com_username, status, age, region, orientation, self_description, style_profile, education, courses"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapTherapist(data as Record<string, unknown>) : null;
}

export async function getTherapistById(id: string): Promise<Therapist | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select(
      "id, slug, name, initials, role, approach, bio, tags, languages, experience, price_per_session, cal_com_username, status, age, region, orientation, self_description, style_profile, education, courses"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapTherapist(data as Record<string, unknown>) : null;
}

export async function getMyBookings(userId: string): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, patient_id, therapist_id, starts_at, ends_at, status, meet_url, amount_gross, amount_net"
    )
    .eq("patient_id", userId)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBooking);
}

export async function getMyNextBooking(userId: string): Promise<Booking | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, patient_id, therapist_id, starts_at, ends_at, status, meet_url, amount_gross, amount_net"
    )
    .eq("patient_id", userId)
    .eq("status", "scheduled")
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBooking(data as Record<string, unknown>) : null;
}

/**
 * Trova il "sessuologo corrente" del paziente: quello con cui ha l'ultima
 * prenotazione (scheduled o completed). Ritorna null se non ha mai prenotato.
 */
export async function getMyCurrentTherapist(
  userId: string
): Promise<Therapist | null> {
  const supabase = await createClient();
  const { data: lastBooking } = await supabase
    .from("bookings")
    .select("therapist_id")
    .eq("patient_id", userId)
    .in("status", ["scheduled", "completed"])
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!lastBooking?.therapist_id) return null;
  return getTherapistById(lastBooking.therapist_id as string);
}

export async function getMyInvoices(userId: string): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id, number, issued_at, amount, pdf_url, therapist_id")
    .eq("patient_id", userId)
    .order("issued_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapInvoice);
}

// Pro queries ----------------------------------------------------------------

export async function getMyTherapistRecord(
  userId: string
): Promise<(Therapist & { iban: string | null; codiceFiscale: string | null; partitaIva: string | null }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("therapists")
    .select(
      "id, slug, name, initials, role, approach, bio, tags, languages, experience, price_per_session, cal_com_username, status, age, region, orientation, self_description, style_profile, education, courses, iban, codice_fiscale, partita_iva"
    )
    .eq("auth_user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const t = mapTherapist(data as Record<string, unknown>);
  return {
    ...t,
    iban: (data.iban as string | null) ?? null,
    codiceFiscale: (data.codice_fiscale as string | null) ?? null,
    partitaIva: (data.partita_iva as string | null) ?? null,
  };
}

export async function getProBookings(therapistId: string): Promise<Booking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, patient_id, therapist_id, starts_at, ends_at, status, meet_url, amount_gross, amount_net"
    )
    .eq("therapist_id", therapistId)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBooking);
}

export type ProPatient = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  initials: string;
  email: string | null;
  city: string | null;
  birthYear: number | null;
  totalSessions: number;
  firstBookingAt: string | null;
  status: "attivo" | "in_valutazione" | "concluso";
};

export async function getProPatients(
  therapistId: string
): Promise<ProPatient[]> {
  const supabase = await createClient();
  // Tutti gli ID paziente con cui il pro ha avuto bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("patient_id, starts_at, status")
    .eq("therapist_id", therapistId);
  if (!bookings || bookings.length === 0) return [];

  const patientIds = Array.from(
    new Set(bookings.map((b) => b.patient_id as string))
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, city, birth_year")
    .in("id", patientIds);

  // Email dei pazienti: non leggibile dai pro via profiles (RLS).
  // Omettiamo per ora, sarà `null`.
  return patientIds.map((id) => {
    const profile = profiles?.find((p) => p.id === id);
    const patientBookings = bookings.filter((b) => b.patient_id === id);
    const completed = patientBookings.filter((b) => b.status === "completed").length;
    const firstAt = patientBookings
      .map((b) => b.starts_at as string)
      .sort()[0] ?? null;
    const firstName = (profile?.first_name as string | null) ?? null;
    const lastName = (profile?.last_name as string | null) ?? null;
    const initials = (
      (firstName?.[0] ?? "?") + (lastName?.[0] ?? "?")
    ).toUpperCase();

    const upcoming = patientBookings.some(
      (b) =>
        b.status === "scheduled" &&
        new Date(b.starts_at as string).getTime() >= Date.now()
    );
    const status: ProPatient["status"] =
      completed === 0 ? "in_valutazione" : upcoming ? "attivo" : "concluso";

    return {
      id,
      firstName,
      lastName,
      initials,
      email: null,
      city: (profile?.city as string | null) ?? null,
      birthYear: (profile?.birth_year as number | null) ?? null,
      totalSessions: completed,
      firstBookingAt: firstAt,
      status,
    };
  });
}

export async function getProPatient(
  therapistId: string,
  patientId: string
): Promise<(ProPatient & { intake: Record<string, unknown> | null }) | null> {
  const patients = await getProPatients(therapistId);
  const match = patients.find((p) => p.id === patientId);
  if (!match) return null;

  const supabase = await createClient();
  const { data: intake } = await supabase
    .from("intake_responses")
    .select("responses")
    .eq("profile_id", patientId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    ...match,
    intake: (intake?.responses as Record<string, unknown> | null) ?? null,
  };
}

// Formatters -----------------------------------------------------------------

// Tutti i formatter usano fuso Italia. Il DB salva timestamp UTC, ma l'utente
// vede sempre l'ora locale italiana. Hardcoded per MVP italiano-only.
const IT_TZ = "Europe/Rome";

const dateFmt = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: IT_TZ,
});
const timeFmt = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: IT_TZ,
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}
export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${dateFmt.format(d)} · ${timeFmt.format(d)}`;
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
export function minutesUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - Date.now()) / 60000);
}
