"use client";

import { useState, useTransition } from "react";
import { Video, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateMeetUrl } from "./meet-link-action";

export function MeetLinkEditor({
  bookingId,
  initialUrl,
}: {
  bookingId: string;
  initialUrl: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [saved, setSaved] = useState(initialUrl);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateMeetUrl(bookingId, url.trim() || null);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setSaved(url.trim() || null);
        setEditing(false);
        toast.success("Link Meet salvato");
      }
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://meet.google.com/abc-defg-hij"
          className="h-8 w-64 text-xs"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={save}
          disabled={isPending}
          className="h-8 w-8 p-0"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setEditing(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex items-center gap-1.5">
        <a
          href={saved}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Video className="h-3 w-3" />
          Meet
        </a>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Modifica link"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="inline-flex items-center gap-1 rounded-md border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
    >
      <Video className="h-3 w-3" />
      Aggiungi link Meet
    </button>
  );
}
