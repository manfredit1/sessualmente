"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  approveApplication,
  rejectApplication,
  reviewApplication,
} from "../actions";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  qualification: string;
  albo: string;
  years_of_practice: number;
  approach: string;
  motivation: string | null;
  cv_url: string | null;
  status: string;
  created_at: string;
};

export function ApplicationRow({ application }: { application: Application }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  const run = (
    fn: (id: string) => Promise<{ success?: boolean; error?: string }>,
    successMsg: string,
    confirmMsg?: string
  ) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    startTransition(async () => {
      const res = await fn(application.id);
      if (res.error) toast.error(res.error);
      else toast.success(successMsg);
    });
  };

  const fullName = `${application.first_name} ${application.last_name}`;
  const submitted = new Date(application.created_at).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canApprove = application.status === "new" || application.status === "review";
  const canReview = application.status === "new";
  const canReject = application.status === "new" || application.status === "review";

  return (
    <div className="rounded-lg border border-border/60 bg-background">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{fullName}</p>
            <Badge variant="secondary">{application.qualification}</Badge>
            <Badge variant="outline">
              {application.years_of_practice} anni di pratica
            </Badge>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {application.email}
            </span>
            {application.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {application.phone}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ricevuta il {submitted} · Albo: <span className="font-mono">{application.albo}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" /> Chiudi
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" /> Dettagli
              </>
            )}
          </Button>
          {canReview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(reviewApplication, "Spostata in review.")
              }
            >
              <Eye className="mr-1 h-4 w-4" /> In review
            </Button>
          )}
          {canReject && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(
                  rejectApplication,
                  "Candidatura rifiutata.",
                  `Rifiutare ${fullName}?`
                )
              }
            >
              <X className="mr-1 h-4 w-4" /> Rifiuta
            </Button>
          )}
          {canApprove && (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() =>
                run(
                  approveApplication,
                  "Candidatura approvata, invito inviato.",
                  `Approvare ${fullName}? Verrà inviato un magic link via email.`
                )
              }
            >
              <Check className="mr-1 h-4 w-4" />
              {isPending ? "..." : "Approva"}
            </Button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="grid gap-4 border-t border-border/60 px-4 py-4 text-sm sm:grid-cols-2">
          <Field label="Qualifica">{application.qualification}</Field>
          <Field label="Numero albo">{application.albo}</Field>
          <Field label="Anni di pratica">{application.years_of_practice}</Field>
          <Field label="Email">{application.email}</Field>
          <Field label="Telefono">{application.phone ?? "—"}</Field>
          <Field label="CV">
            {application.cv_url ? (
              <a
                href={application.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Apri CV
              </a>
            ) : (
              "Non allegato"
            )}
          </Field>
          <Field label="Approccio clinico" span>
            {application.approach || <em className="text-muted-foreground">Non indicato</em>}
          </Field>
          <Field label="Motivazione" span>
            {application.motivation ? (
              <span className="whitespace-pre-wrap">{application.motivation}</span>
            ) : (
              <em className="text-muted-foreground">Non indicata</em>
            )}
          </Field>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1">{children}</p>
    </div>
  );
}
