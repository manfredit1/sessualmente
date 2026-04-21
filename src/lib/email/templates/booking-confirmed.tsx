import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export type BookingConfirmedProps = {
  patientFirstName: string;
  therapistName: string;
  dateLabel: string;
  timeLabel: string;
  timezoneLabel: string;
  meetUrl: string | null;
  dashboardUrl: string;
};

export function BookingConfirmedEmail({
  patientFirstName,
  therapistName,
  dateLabel,
  timeLabel,
  timezoneLabel,
  meetUrl,
  dashboardUrl,
}: BookingConfirmedProps) {
  return (
    <Html lang="it">
      <Head />
      <Preview>
        Seduta confermata con {therapistName} il {dateLabel} alle {timeLabel}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Brand header */}
          <Section style={headerSection}>
            <Text style={brandText}>
              sessualmente<span style={brandDot}>.</span>
            </Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={eyebrow}>Seduta confermata</Text>
            <Heading style={h1}>
              {patientFirstName}, ci siamo.
            </Heading>
            <Text style={lead}>
              La tua prima seduta con <strong>{therapistName}</strong> è
              fissata. Di seguito tutti i dettagli.
            </Text>
          </Section>

          {/* Details card */}
          <Section style={detailCard}>
            <Row style={detailRow}>
              <Column style={detailLabelCol}>
                <Text style={detailLabel}>Quando</Text>
              </Column>
              <Column style={detailValueCol}>
                <Text style={detailValue}>
                  {dateLabel}
                  <br />
                  ore {timeLabel} · {timezoneLabel}
                </Text>
              </Column>
            </Row>
            <Row style={detailRowBorder}>
              <Column style={detailLabelCol}>
                <Text style={detailLabel}>Durata</Text>
              </Column>
              <Column style={detailValueCol}>
                <Text style={detailValue}>50 minuti</Text>
              </Column>
            </Row>
            <Row style={detailRowBorder}>
              <Column style={detailLabelCol}>
                <Text style={detailLabel}>Dove</Text>
              </Column>
              <Column style={detailValueCol}>
                <Text style={detailValue}>Videochiamata Google Meet</Text>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          {meetUrl ? (
            <Section style={ctaSection}>
              <Button href={meetUrl} style={primaryButton}>
                Apri il link della seduta
              </Button>
              <Text style={ctaHint}>
                Ti consigliamo di salvare subito il link in calendario.
              </Text>
            </Section>
          ) : (
            <Section style={ctaSection}>
              <Text style={lead}>
                Il link della videochiamata sarà disponibile nella tua area
                riservata nei prossimi minuti.
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          {/* Checklist */}
          <Section>
            <Text style={sectionTitle}>Prima di collegarti</Text>
            <Text style={bullet}>
              <span style={bulletDot}>•</span> Trova un posto tranquillo, con una connessione stabile
            </Text>
            <Text style={bullet}>
              <span style={bulletDot}>•</span> Usa cuffie o auricolari per proteggere la privacy
            </Text>
            <Text style={bullet}>
              <span style={bulletDot}>•</span> Non serve installare nulla: la seduta apre nel browser
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Area riservata */}
          <Section>
            <Text style={paragraph}>
              Vuoi cambiare data o cancellare la seduta? Dalla tua{" "}
              <Link href={dashboardUrl} style={inlineLink}>
                area riservata
              </Link>{" "}
              puoi farlo in un click, fino a 24 ore prima dell&apos;inizio.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerBrand}>
              sessualmente<span style={brandDotSmall}>.</span>
            </Text>
            <Text style={footerText}>
              Sessuologia online con sessuologi qualificati, in totale
              riservatezza.
            </Text>
            <Text style={footerDisclaimer}>
              Non è un servizio di emergenza. In caso di urgenza chiama il 118
              o il Telefono Amico (02 2327 2327).
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Design tokens ────────────────────────────────────────────────────────
const colors = {
  bg: "#fbfaf7",
  card: "#ffffff",
  text: "#2a241d",
  textMuted: "#7a6f65",
  primary: "#6a2550",
  primaryHover: "#5a1e43",
  border: "#e8e2d8",
  muted: "#f5f1eb",
};

const fontStack =
  '"Helvetica Neue", Helvetica, Arial, "Segoe UI", Roboto, sans-serif';

// ─── Styles ───────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: colors.bg,
  fontFamily: fontStack,
  margin: 0,
  padding: 0,
  color: colors.text,
};

const container: React.CSSProperties = {
  backgroundColor: colors.card,
  maxWidth: "560px",
  margin: "40px auto",
  padding: "0",
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
};

const headerSection: React.CSSProperties = {
  padding: "32px 40px 0",
};

const brandText: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  color: colors.text,
  margin: 0,
};

const brandDot: React.CSSProperties = {
  color: colors.primary,
};

const heroSection: React.CSSProperties = {
  padding: "24px 40px 8px",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: colors.primary,
  margin: "0 0 12px",
};

const h1: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 500,
  lineHeight: "36px",
  letterSpacing: "-0.02em",
  color: colors.text,
  margin: "0 0 12px",
};

const lead: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "24px",
  color: colors.text,
  margin: "0 0 8px",
};

const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: colors.text,
  margin: "0 0 8px",
};

const detailCard: React.CSSProperties = {
  margin: "24px 40px",
  backgroundColor: colors.muted,
  borderRadius: "12px",
  padding: "8px 16px",
};

const detailRow: React.CSSProperties = {
  padding: "12px 0",
};

const detailRowBorder: React.CSSProperties = {
  padding: "12px 0",
  borderTop: `1px solid ${colors.border}`,
};

const detailLabelCol: React.CSSProperties = {
  width: "100px",
  verticalAlign: "top",
};

const detailValueCol: React.CSSProperties = {
  verticalAlign: "top",
};

const detailLabel: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: colors.textMuted,
  margin: 0,
};

const detailValue: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: 500,
  lineHeight: "22px",
  color: colors.text,
  margin: 0,
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "0 40px 24px",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 500,
  textDecoration: "none",
  padding: "14px 32px",
  borderRadius: "10px",
  display: "inline-block",
  letterSpacing: "-0.01em",
};

const ctaHint: React.CSSProperties = {
  fontSize: "13px",
  color: colors.textMuted,
  margin: "16px 0 0",
};

const hr: React.CSSProperties = {
  borderColor: colors.border,
  margin: "0 40px",
  borderTop: `1px solid ${colors.border}`,
  borderBottom: "none",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: colors.text,
  margin: "24px 40px 12px",
};

const bullet: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: colors.text,
  margin: "4px 40px",
};

const bulletDot: React.CSSProperties = {
  color: colors.primary,
  marginRight: "8px",
  fontWeight: 700,
};

const inlineLink: React.CSSProperties = {
  color: colors.primary,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
};

const footerSection: React.CSSProperties = {
  padding: "24px 40px 32px",
  backgroundColor: colors.muted,
  textAlign: "center",
};

const footerBrand: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  color: colors.text,
  margin: "0 0 8px",
};

const brandDotSmall: React.CSSProperties = {
  color: colors.primary,
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: colors.textMuted,
  margin: "0 0 12px",
};

const footerDisclaimer: React.CSSProperties = {
  fontSize: "11px",
  lineHeight: "16px",
  color: colors.textMuted,
  margin: 0,
};
