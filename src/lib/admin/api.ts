import type { ReservationDbStatus } from "@/lib/reservations/status";

export interface HostReservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomPackage: string;
  roomPackageLabel: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  baseRate: number;
  extraGuestFee: number;
  totalAmount: number;
  status: ReservationDbStatus;
  notes: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;
  guestPaymentUrl?: string;
  reservation?: HostReservation | null;
}

async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : "Request failed.",
    );
  }
  return data as T;
}

export async function adminLogin(password: string): Promise<void> {
  await adminFetch("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export async function adminLogout(): Promise<void> {
  await adminFetch("/api/admin/auth/logout", { method: "POST" });
}

export async function adminCheckSession(): Promise<boolean> {
  try {
    const data = await adminFetch<{ authenticated: boolean }>("/api/admin/auth/session");
    return data.authenticated;
  } catch {
    return false;
  }
}

export async function fetchHostReservations(): Promise<HostReservation[]> {
  return adminFetch<HostReservation[]>("/api/admin/reservations");
}

export async function updateHostReservationStatus(
  id: string,
  status: ReservationDbStatus,
  opts?: { stripeCheckoutSessionId?: string | null; stripePaymentIntentId?: string | null },
): Promise<HostReservation> {
  return adminFetch<HostReservation>(`/api/admin/reservations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...opts }),
  });
}

export async function approveHostReservation(id: string): Promise<CheckoutSessionResult> {
  return adminFetch<CheckoutSessionResult>(`/api/admin/reservations/${id}/approve`, {
    method: "POST",
  });
}

export async function createHostCheckoutSession(id: string): Promise<CheckoutSessionResult> {
  return adminFetch<CheckoutSessionResult>(`/api/admin/reservations/${id}/checkout`, {
    method: "POST",
  });
}

export interface HostPaymentLinks {
  guestPaymentUrl: string;
  stripeCheckoutUrl: string | null;
  checkoutUrl: string;
}

export async function fetchHostPaymentLinks(id: string): Promise<HostPaymentLinks> {
  return adminFetch<HostPaymentLinks>(`/api/admin/reservations/${id}/payment-link`);
}

export interface HostCalendarBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchCalendarBlocks(): Promise<HostCalendarBlock[]> {
  return adminFetch<HostCalendarBlock[]>("/api/admin/calendar-blocks");
}

export async function createHostCalendarBlock(input: {
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<HostCalendarBlock> {
  return adminFetch<HostCalendarBlock>("/api/admin/calendar-blocks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteHostCalendarBlock(id: string): Promise<void> {
  await adminFetch<{ ok: boolean }>(`/api/admin/calendar-blocks/${id}`, {
    method: "DELETE",
  });
}
