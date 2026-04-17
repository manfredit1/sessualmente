"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, ChevronDown, ChevronUp, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveApplication, rejectApplication } from "../actions";

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

  const handleApprove = () => {
    if (!confirm(`Approvare ${application.first_name} ${application.last_name}? Verrà inviato un magic link via email.`)) return;
    startTransition(async () => {
      const res = await approveApplication(application.id);
      if (res.error) toast.error(res.error);
      else toast.success("Candidatura approvata, invito inviato.");
    });
  };

  const handleReject = () => {
    if (!confirm(`Rifiutare ${application.first_name} ${application.last_name}?`)) return;
    startTransition(async () => {
      const res = await rejectApplication(application.id);
      if (res.error) toast.error(res.error);
      else toast.success("Candidatura rifiutata.");
    });
  };

  const submitted = new Date(application.created_at).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-border/60 bg-background">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">
              {application.first_name} {application.last_name}
            </p>
            <Badge variant="secondary">{application.qualification}</Badge>
            <Badge variant="outline">{application.years_of_practice} anni</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {application.email}
            {application.phone && <> · {application.phone}</>}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Candidatura del {submitted} · Albo: {application.albo}
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleReject}
          >
            <X className="mr-1 h-4 w-4" /> Rifiuta
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleApprove}
          >
            <Check className="mr-1 h-4 w-4" />
            {isPending ? "..." : "Approva"}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="space-y-3 border-t border-border/60 px-4 py-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Approccio
            </p>
            <p className="mt-1">{application.approach}</p>
          </div>
          {application.motivation && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Motivazione
              </p>
              <p className="mt-1 whitespace-pre-wrap">{application.motivation}</p>
            </div>
          )}
          {application.cv_url && (
            <a
              href={application.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> CV allegato
            </a>
          )}
        </div>
      )}
    </div>
  );
}
