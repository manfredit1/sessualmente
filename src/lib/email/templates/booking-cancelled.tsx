import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type BookingCancelledProps = {
  patientFirstName: string;
  therapistName: string;
  dateLabel: string;
  timeLabel: string;
  bookingAgainUrl: string;
};

export function BookingCancelledEmail({
  patientFirstName,
  therapistName,
  dateLabel,
  timeLabel,
  bookingAgainUrl,
}: BookingCancelledProps) {
  return (
    <Html lang="it">
      <Head />
      <Preview>
        Seduta con {therapistName} del {dateLabel} cancellata.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={brandText}>
              sessualmente<span style={brandDot}>.</span>
            </Text>
          </Section>

          <Section style={heroSection}>
            <Text style={eyebrow}>Seduta cancellata</Text>
            <Heading style={h1}>
              {patientFirstName}, la seduta è stata annullata.
            </Heading>
            <Text style={lead}>
              Ti confermiamo che la seduta con <strong>{therapistName}</strong>{" "}
              del <strong>{dateLabel}</strong> alle <strong>{timeLabel}</strong>{" "}
              è stata cancellata. Nessun addebito è stato effettuato.
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button href={bookingAgainUrl} style={primaryButton}>
              Prenota una nuova seduta
            </Button>
            <Text style={ctaHint}>
              Puoi scegliere lo stesso sessuologo o provarne un altro.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footerBrand}>
              sessualmente<span style={brandDotSmall}>.</span>
            </Text>
            <Text style={footerText}>
              Sessuologia online con sessuologi qualificati, in totale
              riservatezza.
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
  fontSize: "26px",
  fontWeight: 500,
  lineHeight: "34px",
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

const ctaSection: React.CSSProperties = {
  textAlign: "center",
  padding: "16px 40px 32px",
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
  margin: "0",
  borderTop: `1px solid ${colors.border}`,
  borderBottom: "none",
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
  margin: 0,
};
