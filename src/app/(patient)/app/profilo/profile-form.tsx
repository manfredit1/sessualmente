"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CurrentUser } from "@/lib/user";
import { updateProfile } from "./actions";

export function ProfileForm({
  user,
  email,
}: {
  user: CurrentUser;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success) toast.success("Profilo aggiornato");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <Field id="firstName" label="Nome" defaultValue={user.firstName ?? ""} />
      <Field id="lastName" label="Cognome" defaultValue={user.lastName ?? ""} />
      <Field
        id="email"
        label="Email"
        type="email"
        defaultValue={email}
        disabled
        hint="Per cambiare email contatta il supporto."
      />
      <Field
        id="phone"
        label="Telefono"
        type="tel"
        defaultValue={user.phone ?? ""}
      />
      <Field
        id="birthYear"
        label="Anno di nascita"
        type="number"
        defaultValue={user.birthYear ? String(user.birthYear) : ""}
      />
      <Field id="city" label="Città" defaultValue={user.city ?? ""} />
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? (
            "Salvataggio..."
          ) : state?.success ? (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Salvato
            </>
          ) : (
            "Salva modifiche"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  disabled,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
