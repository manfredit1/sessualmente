-- Permette ai terapisti di leggere il profilo (first_name, last_name, city,
-- birth_year) dei pazienti con cui hanno almeno una booking.
-- Senza questa policy, il pro vede "??" perché profiles_select_own limita
-- a solo il proprio profilo.

CREATE POLICY "therapists_read_matched_patient_profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.therapists t ON t.id = b.therapist_id
      WHERE b.patient_id = profiles.id
        AND t.auth_user_id = auth.uid()
    )
  );
