"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setTherapistStatus } from "../actions";

type Status = "pending" | "active" | "suspended";

export function TherapistStatusSelect({
  therapistId,
  current,
}: {
  therapistId: string;
  current: Status;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string | null) => {
    if (!next || next === current) return;
    startTransition(async () => {
      const res = await setTherapistStatus(
        therapistId,
        next as Status
      );
      if (res.error) toast.error(res.error);
      else toast.success(`Stato aggiornato: ${next}.`);
    });
  };

  return (
    <Select
      value={current}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="h-8 w-[130px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="suspended">Suspended</SelectItem>
      </SelectContent>
    </Select>
  );
}
