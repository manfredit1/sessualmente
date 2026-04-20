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
          <Heading style={h1}>Seduta cancellata</Heading>
          <Text style={paragraph}>Ciao {patientFirstName},</Text>
          <Text style={paragraph}>
            Ti confermiamo che la seduta con{" "}
            <strong>{therapistName}</strong> del <strong>{dateLabel}</strong>{" "}
            alle <strong>{timeLabel}</strong> è stata cancellata.
          </Text>

          <Text style={paragraph}>
            Nessun addebito è stato effettuato. Puoi riprenotare quando vuoi
            dalla tua area riservata.
          </Text>

          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button href={bookingAgainUrl} style={button}>
              Prenota di nuovo
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Sessualmente · sessuologia online con sessuologi qualificati
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

const hr: React.CSSProperties = {
  borderColor: "#e7e5e4",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  color: "#78716c",
  fontSize: "13px",
  margin: "4px 0",
};
