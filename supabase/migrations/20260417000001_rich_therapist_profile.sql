-- =============================================================================
-- Arricchimento profilo terapista: campi per la pagina "scopri il sessuologo".
-- Tutti nullable per retrocompatibilità con righe esistenti.
-- =============================================================================

ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS age               int,
  ADD COLUMN IF NOT EXISTS region            text,
  ADD COLUMN IF NOT EXISTS orientation       text,
  ADD COLUMN IF NOT EXISTS self_description  text,
  ADD COLUMN IF NOT EXISTS style_profile     jsonb,
  ADD COLUMN IF NOT EXISTS education         jsonb,
  ADD COLUMN IF NOT EXISTS courses           text[];

COMMENT ON COLUMN public.therapists.age IS 'Età del sessuologo (mostrata al paziente)';
COMMENT ON COLUMN public.therapists.region IS 'Regione italiana di residenza (Lazio, Lombardia, ecc.)';
COMMENT ON COLUMN public.therapists.orientation IS 'Orientamento teorico (Cognitivo Comportamentale, Sistemico, Gestalt, ecc.)';
COMMENT ON COLUMN public.therapists.self_description IS 'Self-presentation estesa (200-500 parole)';
COMMENT ON COLUMN public.therapists.style_profile IS 'Slider 0-100: {formale_informale, riflessivo_razionale, spazio_scaletta, lascia_guida}';
COMMENT ON COLUMN public.therapists.education IS 'Array di oggetti {type: albo|laurea|specializzazione|esperienza, description}';
COMMENT ON COLUMN public.therapists.courses IS 'Array di corsi e aggiornamenti recenti';
