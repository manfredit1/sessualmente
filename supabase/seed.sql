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
