"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ReservationStatus, type Reservation } from "@/types/reservation";
import { getAccessToken } from "@/lib/auth/token";
import { getReservations, mapReservationSummaryToReservation } from "@/lib/api/reservations";
import { getApiErrorMessage } from "@/lib/api/errors";

/** Client-side cache for anonymous booking UX only — never seeded with demo data. */
const STORAGE_KEY = "pld_reservation_client_cache";

/** One-time: drop legacy keys that held demo rows (`pld_reservations`). */
const LEGACY_KEYS = ["pld_reservations", "pld_reservations_seeded"] as const;
const MIGRATION_SESSION_KEY = "pld_legacy_storage_cleared_v3";

function migrateLegacyLocalStorage(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(MIGRATION_SESSION_KEY)) return;
  try {
    for (const k of LEGACY_KEYS) {
      localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(MIGRATION_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function loadFromStorage(): Reservation[] {
  if (typeof window === "undefined") return [];
  if (getAccessToken()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Reservation[];
  } catch {
    return [];
  }
}

function saveToStorage(reservations: Reservation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  } catch {}
}

// ── Allowed admin transitions ───────────────────────────────

/** Tuxedo Retreat — simplified approval flow. */
const ADMIN_TRANSITIONS: Partial<Record<ReservationStatus, ReservationStatus[]>> = {
  [ReservationStatus.PendingReview]: [
    ReservationStatus.AwaitingPayment,
    ReservationStatus.Rejected,
    ReservationStatus.Cancelled,
  ],
  [ReservationStatus.AwaitingPayment]: [
    ReservationStatus.Confirmed,
    ReservationStatus.Cancelled,
  ],
  [ReservationStatus.Confirmed]: [
    ReservationStatus.Completed,
    ReservationStatus.Cancelled,
  ],
};

export function getAllowedTransitions(status: ReservationStatus): ReservationStatus[] {
  return ADMIN_TRANSITIONS[status] ?? [];
}

// ── Context ─────────────────────────────────────────────────

interface ReservationStoreContextValue {
  reservations: Reservation[];
  addReservation: (r: Reservation) => void;
  updateStatus: (id: string, status: ReservationStatus) => void;
  getById: (id: string) => Reservation | undefined;
  isLoaded: boolean;
  /** Set when logged-in admin list fetch fails (401, network, wrong API URL, etc.). */
  adminReservationsError: string | null;
  clearAdminReservationsError: () => void;
  /** Replace list from `GET /api/admin/reservations` (requires admin JWT). */
  refreshReservationsFromApi: () => Promise<void>;
  /** After admin logout: clear cached list (avoids showing DB data to the next user on this device). */
  clearReservationsCache: () => void;
}

const ReservationStoreContext = createContext<ReservationStoreContextValue | null>(null);

export function ReservationStoreProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminReservationsError, setAdminReservationsError] = useState<string | null>(null);

  useEffect(() => {
    migrateLegacyLocalStorage();
  }, []);

  const clearAdminReservationsError = useCallback(() => {
    setAdminReservationsError(null);
  }, []);

  const refreshReservationsFromApi = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setAdminReservationsError(null);
    try {
      const list = await getReservations();
      setReservations(list.map(mapReservationSummaryToReservation));
    } catch (e) {
      setAdminReservationsError(getApiErrorMessage(e));
      throw e;
    }
  }, []);

  const clearReservationsCache = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      for (const k of LEGACY_KEYS) {
        localStorage.removeItem(k);
      }
    } catch {
      /* ignore */
    }
    setReservations([]);
    setAdminReservationsError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const token = getAccessToken();
      if (token) {
        setAdminReservationsError(null);
        try {
          const list = await getReservations();
          if (!cancelled) {
            setReservations(list.map(mapReservationSummaryToReservation));
          }
        } catch (e) {
          if (!cancelled) {
            setReservations([]);
            setAdminReservationsError(getApiErrorMessage(e));
          }
        }
      } else if (!cancelled) {
        setReservations(loadFromStorage());
      }
      if (!cancelled) setIsLoaded(true);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Persist only anonymous session rows (post-booking client state). Admins use API only. */
  useEffect(() => {
    if (!isLoaded) return;
    if (getAccessToken()) return;
    saveToStorage(reservations);
  }, [reservations, isLoaded]);

  const addReservation = useCallback((r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status } : x)),
    );
  }, []);

  const getById = useCallback(
    (id: string) => reservations.find((x) => x.id === id),
    [reservations],
  );

  return (
    <ReservationStoreContext.Provider
      value={{
        reservations,
        addReservation,
        updateStatus,
        getById,
        isLoaded,
        adminReservationsError,
        clearAdminReservationsError,
        refreshReservationsFromApi,
        clearReservationsCache,
      }}
    >
      {children}
    </ReservationStoreContext.Provider>
  );
}

export function useReservationStore() {
  const ctx = useContext(ReservationStoreContext);
  if (!ctx) {
    throw new Error("useReservationStore must be used within ReservationStoreProvider");
  }
  return ctx;
}
