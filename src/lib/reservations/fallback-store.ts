import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { ReservationStatus } from "@prisma/client";
import type { StayPackageId } from "@/lib/pricing/stay-packages";
import type { ReservationPricing } from "./helpers";

export interface CreateReservationInput {
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  roomPackage: StayPackageId;
  checkIn: string;
  checkOut: string;
  notes?: string | null;
}

const ReservationDbStatus = ReservationStatus;

export interface FallbackReservationRecord {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomPackage: StayPackageId;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  baseRate: number;
  extraGuestFee: number;
  totalAmount: number;
  status: typeof ReservationDbStatus.PENDING_REVIEW;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  storage: "fallback";
}

function storeFilePath(): string {
  if (process.env.VERCEL === "1") {
    return "/tmp/wbr-reservations.json";
  }
  return join(process.cwd(), ".data", "reservations.json");
}

async function readStore(): Promise<FallbackReservationRecord[]> {
  try {
    const raw = await readFile(storeFilePath(), "utf8");
    const parsed = JSON.parse(raw) as FallbackReservationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(rows: FallbackReservationRecord[]): Promise<void> {
  const file = storeFilePath();
  if (!process.env.VERCEL) {
    await mkdir(join(process.cwd(), ".data"), { recursive: true });
  }
  await writeFile(file, JSON.stringify(rows, null, 2), "utf8");
}

export async function fallbackCreateReservation(
  input: CreateReservationInput,
  pricing: ReservationPricing,
): Promise<FallbackReservationRecord> {
  const now = new Date().toISOString();
  const row: FallbackReservationRecord = {
    id: randomUUID(),
    guestName: input.guestName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    guestCount: input.guestCount,
    roomPackage: input.roomPackage,
    checkIn: input.checkIn.slice(0, 10),
    checkOut: input.checkOut.slice(0, 10),
    nights: pricing.nights,
    baseRate: pricing.baseRate,
    extraGuestFee: pricing.extraGuestFee,
    totalAmount: pricing.totalAmount,
    status: ReservationDbStatus.PENDING_REVIEW,
    notes: input.notes?.trim() || null,
    createdAt: now,
    updatedAt: now,
    storage: "fallback",
  };

  const rows = await readStore();
  rows.unshift(row);
  await writeStore(rows);

  console.info("[booking] reservation saved (fallback store)", {
    id: row.id,
    email: row.email,
    checkIn: row.checkIn,
    checkOut: row.checkOut,
    totalAmount: row.totalAmount,
  });

  return row;
}

export async function fallbackListReservations(): Promise<FallbackReservationRecord[]> {
  return readStore();
}
