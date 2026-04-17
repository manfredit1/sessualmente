"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelBooking } from "./actions";

const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;

export function CancelBookingButton({
  bookingId,
  startsAt,
  size = "sm",
}: {
  bookingId: string;
  startsAt: string;
  size?: "sm" | "default";
}) {
  const [isPending, startTransition] = useTransition();
  const [mountedAt] = useState(() => Date.now());
  const canCancel =
    new Date(startsAt).getTime() - mountedAt > CANCEL_WINDOW_MS;

  const handleCancel = () => {
    if (
      !confirm(
        "Cancellare questa seduta? Il terapista verrà notificato e lo slot tornerà disponibile."
      )
    )
      return;
    startTransition(async () => {
      const res = await cancelBooking(bookingId);
      if (res.error) toast.error(res.error);
      else toast.success("Seduta cancellata.");
    });
  };

  if (!canCancel) {
    return (
      <span
        className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground"
        title="Le sedute si cancellano fino a 24 ore prima dell'inizio"
      >
        <X className="h-3 w-3" />
        Non cancellabile
      </span>
    );
  }

  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      disabled={isPending}
      onClick={handleCancel}
    >
      <X className="mr-1 h-3.5 w-3.5" />
      {isPending ? "..." : "Cancella"}
    </Button>
  );
}
