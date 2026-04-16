"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

/**
 * Embed Cal.com inline per la pagina di prenotazione.
 *
 * Props:
 * - calLink: es. "giulia-bianchi/50min" (username + event type)
 * - patientEmail: prefilla l'email nel form di Cal
 * - therapistSlug: passato come metadata per il webhook
 *
 * Il tema e i colori sono allineati al nostro brand. Quando l'utente conferma
 * un booking, Cal.com manda un webhook → il nostro endpoint crea la
 * riga `bookings` (TODO: wiring webhook in route /api/cal/webhook).
 */
export function CalEmbed({
  calLink,
  patientEmail,
  patientName,
  therapistSlug,
}: {
  calLink: string;
  patientEmail?: string;
  patientName?: string;
  therapistSlug: string;
}) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "sessualmente" });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#6a2550",
            "cal-text-emphasis": "#2a1d25",
            "cal-bg-emphasis": "#f5eaee",
          },
          dark: {
            "cal-brand": "#b47096",
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="sessualmente"
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        layout: "month_view",
        name: patientName ?? "",
        email: patientEmail ?? "",
        metadata: {
          therapistSlug,
          source: "sessualmente-webapp",
        },
      }}
    />
  );
}
