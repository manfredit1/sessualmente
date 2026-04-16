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
