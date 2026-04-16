// Tipi e helper puri, importabili anche da client components.
// Niente import server-only qui.

export type Role = "patient" | "pro" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  city: string | null;
  birthYear: number | null;
  createdAt: string;
};

export function displayName(user: CurrentUser): string {
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.email;
}

export function initialsOf(user: CurrentUser): string {
  if (user.firstName && user.lastName) {
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  }
  if (user.firstName) return user.firstName.slice(0, 2).toUpperCase();
  return user.email.slice(0, 2).toUpperCase();
}
