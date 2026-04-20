import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type BookingConfirmedProps = {
  patientFirstName: string;
  therapistName: string;
  dateLabel: string; // es. "venerdì 25 aprile 2026"
  timeLabel: string; // es. "18:00"
  timezoneLabel: string; // es. "Europe/Rome"
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
        Seduta confermata con {therapistName} il {dateLabel} alle {timeLabel}.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Seduta confermata</Heading>
          <Text style={paragraph}>Ciao {patientFirstName},</Text>
          <Text style={paragraph}>
            La tua seduta con <strong>{therapistName}</strong> è confermata.
          </Text>

          <Section style={card}>
            <Text style={label}>Quando</Text>
            <Text style={value}>
              {dateLabel}, ore {timeLabel} ({timezoneLabel})
            </Text>
            <Text style={label}>Durata</Text>
            <Text style={value}>50 minuti</Text>
            <Text style={label}>Dove</Text>
            <Text style={value}>Videochiamata online</Text>
          </Section>

          {meetUrl ? (
            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <Button href={meetUrl} style={button}>
                Apri il link della seduta
              </Button>
              <Text style={smallLink}>
                Oppure copia questo URL:{" "}
                <Link href={meetUrl}>{meetUrl}</Link>
              </Text>
            </Section>
          ) : (
            <Text style={paragraph}>
              Il link della videochiamata sarà disponibile nella tua area
              riservata a breve.
            </Text>
          )}

          <Hr style={hr} />

          <Text style={paragraph}>
            <strong>Cosa serve per la seduta</strong>
          </Text>
          <Text style={bullet}>• Una connessione stabile e un posto tranquillo</Text>
          <Text style={bullet}>• Cuffie o auricolari (per privacy)</Text>
          <Text style={bullet}>• Nessun software da installare, la seduta apre nel browser</Text>

          <Hr style={hr} />

          <Text style={paragraph}>
            Gestisci o annulla la seduta dalla tua{" "}
            <Link href={dashboardUrl}>area riservata</Link>. Puoi cancellare
            fino a 24 ore prima dell&apos;inizio.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Sessualmente · sessuologia online con sessuologi qualificati
          </Text>
          <Text style={footerSmall}>
            Hai ricevuto questa email perché hai prenotato una seduta sulla
            nostra piattaforma. Non è un servizio di emergenza. In caso di
            urgenza chiama il 118 o il Telefono Amico.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f5f5f4",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "560px",
  margin: "32px auto",
  padding: "32px",
  borderRadius: "12px",
};

const h1: React.CSSProperties = {
  color: "#111",
  fontSize: "24px",
  fontWeight: 600,
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "12px 0",
};

const bullet: React.CSSProperties = {
  ...paragraph,
  margin: "4px 0",
};

const card: React.CSSProperties = {
  backgroundColor: "#fafaf9",
  border: "1px solid #e7e5e4",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const label: React.CSSProperties = {
  color: "#78716c",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  margin: "8px 0 4px",
};

const value: React.CSSProperties = {
  color: "#111",
  fontSize: "15px",
  fontWeight: 500,
  margin: "0 0 8px",
};

const button: React.CSSProperties = {
  backgroundColor: "#b85454",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  display: "inline-block",
};

const smallLink: React.CSSProperties = {
  color: "#78716c",
  fontSize: "12px",
  margin: "12px 0 0",
};

const hr: React.CSSProperties = {
  borderColor: "#e7e5e4",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#78716c",
  fontSize: "13px",
  margin: "4px 0",
};

const footerSmall: React.CSSProperties = {
  color: "#a8a29e",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "8px 0",
};
