-- =============================================================================
-- Sessualmente — schema iniziale
-- Tabelle: profiles, therapists, intake_responses, bookings, invoices,
--          pro_applications, audit_log
-- =============================================================================

-- Types -----------------------------------------------------------------------

CREATE TYPE public.user_role AS ENUM ('patient', 'pro', 'admin');
CREATE TYPE public.therapist_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE public.booking_status
  AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE public.application_status
  AS ENUM ('new', 'review', 'approved', 'rejected');

-- Profiles --------------------------------------------------------------------
-- 1:1 con auth.users. Auto-popolata da trigger on signup.

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          public.user_role NOT NULL DEFAULT 'patient',
  first_name    text,
  last_name     text,
  phone         text,
  city          text,
  birth_year    int,
  marketing_ok  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Therapists catalog ----------------------------------------------------------
-- Indipendente da auth.users: possiamo avere therapist entry prima che il
-- professionista abbia fatto signup (onboarding manuale admin).
-- Quando il pro fa login, si collega la riga via `auth_user_id`.

CREATE TABLE public.therapists (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id        uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  slug                text UNIQUE NOT NULL,
  name                text NOT NULL,
  initials            text NOT NULL,
  role                text NOT NULL,
  approach            text NOT NULL,
  bio                 text NOT NULL,
  tags                text[] NOT NULL DEFAULT '{}',
  languages           text[] NOT NULL DEFAULT '{}',
  experience          text,
  price_per_session   int NOT NULL DEFAULT 6500, -- in cents (65€)
  cal_com_username    text,
  status              public.therapist_status NOT NULL DEFAULT 'pending',
  email               text,
  phone               text,
  codice_fiscale      text,
  partita_iva         text,
  iban                text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Intake responses (questionario) --------------------------------------------
-- Può arrivare PRE-auth (email + responses), poi legato al profile quando
-- l'utente clicca il magic link.

CREATE TABLE public.intake_responses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  email               text NOT NULL,
  responses           jsonb NOT NULL,
  clinical_consent    boolean NOT NULL DEFAULT false,
  marketing_consent   boolean NOT NULL DEFAULT false,
  submitted_at        timestamptz NOT NULL DEFAULT now()
);

-- Bookings --------------------------------------------------------------------

CREATE TABLE public.bookings (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id                uuid NOT NULL
                              REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id              uuid NOT NULL
                              REFERENCES public.therapists(id) ON DELETE RESTRICT,
  starts_at                 timestamptz NOT NULL,
  ends_at                   timestamptz NOT NULL,
  status                    public.booking_status NOT NULL DEFAULT 'scheduled',
  meet_url                  text,
  cal_event_id              text,
  stripe_payment_intent_id  text,
  amount_gross              int NOT NULL, -- cents
  amount_net                int NOT NULL, -- cents
  notes                     text,         -- paziente-visible
  therapist_notes           text,         -- therapist-only
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- Invoices --------------------------------------------------------------------

CREATE TABLE public.invoices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id    uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  patient_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id  uuid NOT NULL REFERENCES public.therapists(id) ON DELETE RESTRICT,
  number        text NOT NULL UNIQUE,
  issued_at     timestamptz NOT NULL DEFAULT now(),
  amount        int NOT NULL,
  pdf_url       text
);

-- Pro applications (form pubblico) -------------------------------------------

CREATE TABLE public.pro_applications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name          text NOT NULL,
  last_name           text NOT NULL,
  email               text NOT NULL,
  phone               text,
  qualification       text NOT NULL,
  albo                text NOT NULL,
  years_of_practice   int NOT NULL,
  approach            text NOT NULL,
  motivation          text,
  cv_url              text,
  status              public.application_status NOT NULL DEFAULT 'new',
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Audit log (accessi a dati sensibili) ---------------------------------------

CREATE TABLE public.audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name    text NOT NULL,
  record_id     uuid,
  action        text NOT NULL, -- 'read' | 'insert' | 'update' | 'delete'
  metadata      jsonb,
  accessed_at   timestamptz NOT NULL DEFAULT now()
);

-- Triggers --------------------------------------------------------------------

-- Auto-crea profile quando un utente si registra.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'patient')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Aggiorna updated_at automaticamente.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes ---------------------------------------------------------------------

CREATE INDEX idx_bookings_patient       ON public.bookings(patient_id);
CREATE INDEX idx_bookings_therapist     ON public.bookings(therapist_id);
CREATE INDEX idx_bookings_starts_at     ON public.bookings(starts_at);
CREATE INDEX idx_invoices_patient       ON public.invoices(patient_id);
CREATE INDEX idx_therapists_auth_user   ON public.therapists(auth_user_id);
CREATE INDEX idx_therapists_status_active
  ON public.therapists(status) WHERE status = 'active';
CREATE INDEX idx_intake_profile         ON public.intake_responses(profile_id);
CREATE INDEX idx_intake_email           ON public.intake_responses(email);

-- =============================================================================
-- Sessualmente — Row Level Security policies
-- Modello:
--   - Pazienti vedono solo i propri dati.
--   - Professionisti (therapists con auth_user_id) vedono solo i propri
--     pazienti assegnati via bookings.
--   - Admin usa service_role key lato server.
--   - Cataloghi pubblici (therapists attivi) leggibili da chiunque.
-- =============================================================================

-- Enable RLS su tutte le tabelle con dati personali
ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log           ENABLE ROW LEVEL SECURITY;

-- Profiles --------------------------------------------------------------------

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert gestito dal trigger on_auth_user_created, non serve policy.

-- Therapists ------------------------------------------------------------------

-- Chiunque (anche anon) vede i therapists attivi — serve per marketing e
-- pagina /specialisti prima del login.
CREATE POLICY "therapists_select_active" ON public.therapists
  FOR SELECT USING (status = 'active');

-- Il pro vede anche il proprio record (anche se non active).
CREATE POLICY "therapists_select_own" ON public.therapists
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Il pro aggiorna solo il proprio record.
CREATE POLICY "therapists_update_own" ON public.therapists
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Intake responses ------------------------------------------------------------

-- Chiunque può inserire una risposta al questionario (anche pre-auth).
CREATE POLICY "intake_insert_anyone" ON public.intake_responses
  FOR INSERT WITH CHECK (
    -- pre-auth: nessun profile_id
    profile_id IS NULL
    -- post-auth: solo il paziente stesso
    OR profile_id = auth.uid()
  );

-- Il paziente vede solo le proprie risposte.
CREATE POLICY "intake_select_own_patient" ON public.intake_responses
  FOR SELECT USING (profile_id = auth.uid());

-- Il therapist vede l'intake del paziente con cui ha una booking.
CREATE POLICY "intake_select_matched_therapist" ON public.intake_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.therapists t ON t.id = b.therapist_id
      WHERE b.patient_id = intake_responses.profile_id
        AND t.auth_user_id = auth.uid()
    )
  );

-- Bookings --------------------------------------------------------------------

CREATE POLICY "bookings_select_patient" ON public.bookings
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "bookings_select_therapist" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.therapists t
      WHERE t.id = bookings.therapist_id
        AND t.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "bookings_insert_patient" ON public.bookings
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "bookings_update_patient" ON public.bookings
  FOR UPDATE USING (patient_id = auth.uid());

CREATE POLICY "bookings_update_therapist" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.therapists t
      WHERE t.id = bookings.therapist_id
        AND t.auth_user_id = auth.uid()
    )
  );

-- Invoices --------------------------------------------------------------------

CREATE POLICY "invoices_select_patient" ON public.invoices
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "invoices_select_therapist" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.therapists t
      WHERE t.id = invoices.therapist_id
        AND t.auth_user_id = auth.uid()
    )
  );

-- Pro applications ------------------------------------------------------------

-- Chiunque può candidarsi tramite il form pubblico.
CREATE POLICY "pro_applications_insert_anyone" ON public.pro_applications
  FOR INSERT WITH CHECK (true);

-- Nessuna policy di SELECT: le candidature sono visibili solo via service_role
-- (admin via Supabase Studio o server-side).

-- Audit log -------------------------------------------------------------------

-- Nessuna policy: accessibile solo via service_role.

-- =============================================================================
-- Seed iniziale: 3 sessuologi demo visibili sul catalogo pubblico.
-- I pro veri si collegheranno via `auth_user_id` quando fanno signup.
-- Riproducibile: pulisce prima di inserire.
-- =============================================================================

DELETE FROM public.therapists WHERE slug IN ('giulia-bianchi', 'luca-ferrari', 'sara-conti');

INSERT INTO public.therapists (
  slug, name, initials, role, approach, bio, tags, languages, experience,
  price_per_session, cal_com_username, status
) VALUES
(
  'giulia-bianchi',
  'Dott.ssa Giulia Bianchi',
  'GB',
  'Sessuologa clinica',
  'Sistemico-relazionale',
  'Specializzata in dinamiche di coppia, desiderio e conflitto relazionale. Lavoro con individui e coppie, con particolare attenzione a chi attraversa fasi di cambiamento (genitorialità, convivenza, separazione). Il mio approccio è caldo ma strutturato: ci concentriamo sul qui e ora, senza abbandonare la storia che ti ha portato fin qui.',
  ARRAY['Coppia', 'Desiderio', 'Conflitto'],
  ARRAY['Italiano', 'Inglese'],
  '8 anni di pratica clinica',
  6500,
  'giulia-bianchi',
  'active'
),
(
  'luca-ferrari',
  'Dott. Luca Ferrari',
  'LF',
  'Sessuologo e psicoterapeuta',
  'Cognitivo-comportamentale',
  'Mi occupo di disfunzioni sessuali maschili e femminili, ansia da prestazione e temi legati all''identità. L''approccio cognitivo-comportamentale è orientato a obiettivi concreti in tempi definiti: nella prima seduta capiamo insieme cosa c''è da mettere a fuoco, poi costruiamo un percorso con check regolari.',
  ARRAY['Ansia da prestazione', 'Disfunzioni', 'Identità'],
  ARRAY['Italiano'],
  '12 anni di pratica clinica',
  6500,
  'luca-ferrari',
  'active'
),
(
  'sara-conti',
  'Dott.ssa Sara Conti',
  'SC',
  'Sessuologa',
  'Gestaltico e corporeo',
  'Accompagno persone LGBTQ+, giovani adulti e chi ha vissuto esperienze traumatiche. Lavoro molto sul corpo, sull''ascolto e sulla rielaborazione non verbale. Se senti che le parole non bastano, questo approccio può aiutarti a ritrovare un contatto con te stesso/a.',
  ARRAY['LGBTQ+', 'Trauma', 'Giovani adulti'],
  ARRAY['Italiano', 'Spagnolo'],
  '6 anni di pratica clinica',
  6500,
  'sara-conti',
  'active'
);
