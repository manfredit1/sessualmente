-- =============================================================================
-- Sessualmente — vista KPI per mini-admin
-- Aggrega contatori su therapists, profiles, bookings, pro_applications.
-- Uso previsto: lettura server-side via admin client (service_role).
-- security_invoker protegge comunque da eventuali accessi con chiave anon.
-- =============================================================================

CREATE OR REPLACE VIEW public.admin_kpi
WITH (security_invoker = true)
AS
SELECT
  (SELECT count(*)::int
     FROM public.therapists
     WHERE status = 'active') AS active_therapists,
  (SELECT count(*)::int
     FROM public.profiles
     WHERE role = 'patient') AS patients,
  (SELECT count(*)::int
     FROM public.bookings
     WHERE starts_at >= date_trunc('month', now())) AS bookings_this_month,
  (SELECT coalesce(sum(amount_gross), 0)::int
     FROM public.bookings
     WHERE starts_at >= date_trunc('month', now())
       AND status = 'completed') AS gross_this_month,
  (SELECT count(*)::int
     FROM public.pro_applications
     WHERE status IN ('new', 'review')) AS pending_applications;

GRANT SELECT ON public.admin_kpi TO service_role;
