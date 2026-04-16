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
