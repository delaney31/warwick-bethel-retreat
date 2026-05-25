// Mirrors the backend API response shapes.
// Keep in sync with PacificLuxe.Application DTOs.

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Auth ──────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// ─── User ──────────────────────────────────────────────────

export type UserRole = "renter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
}

// ─── Vehicle ───────────────────────────────────────────────

export type VehicleClass = "sports" | "suv" | "sedan" | "convertible" | "coupe";
export type VehicleStatus = "available" | "offline" | "maintenance" | "retired";

export interface VehicleImage {
  id: string;
  url: string;
  position: number;
  altText: string;
}

export interface VehicleSummary {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  vehicleClass: VehicleClass;
  dailyRate: number;
  heroImage: VehicleImage | null;
  status: VehicleStatus;
}

export interface VehicleDetail extends VehicleSummary {
  color: string;
  engine: string;
  horsepower: number;
  transmission: string;
  fuelType: string;
  seats: number;
  weeklyRate: number;
  monthlyRate: number;
  mileageLimitPerDay: number;
  excessMileageFee: number;
  description: string;
  features: string[];
  images: VehicleImage[];
}

// ─── Booking ───────────────────────────────────────────────

export type BookingStatus =
  | "pending_approval"
  | "rejected"
  | "approved_awaiting_documents"
  | "documents_needs_resubmission"
  | "documents_verified"
  | "agreement_signed"
  | "paid_ready_for_pickup"
  | "active_rental"
  | "completed"
  | "cancelled";

export interface BookingSummary {
  id: string;
  vehicleName: string;
  heroImage: string | null;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
}

export interface BookingDetail extends BookingSummary {
  renterId: string;
  vehicleId: string;
  baseRate: number;
  depositAmount: number;
  taxes: number;
  fees: number;
  adminNotes: string | null;
  renterNotes: string | null;
  pickupLocation: string | null;
  pickupTime: string | null;
  returnLocation: string | null;
  returnTime: string | null;
  documents: DocumentInfo[];
  agreement: AgreementInfo | null;
  payments: PaymentInfo[];
  inspections: InspectionInfo[];
  createdAt: string;
}

// ─── Document ──────────────────────────────────────────────

export type DocumentType =
  | "drivers_license_front"
  | "drivers_license_back"
  | "insurance"
  | "secondary_id";
export type DocumentStatus = "pending" | "accepted" | "rejected";

export interface DocumentInfo {
  id: string;
  type: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  adminNotes: string | null;
  uploadedAt: string;
}

// ─── Agreement ─────────────────────────────────────────────

export interface AgreementInfo {
  id: string;
  signedPdfUrl: string | null;
  signedAt: string | null;
  createdAt: string;
}

// ─── Payment ───────────────────────────────────────────────

export type PaymentType =
  | "rental_fee"
  | "deposit"
  | "additional_charge"
  | "refund";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface PaymentInfo {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  createdAt: string;
}

// ─── Inspection ────────────────────────────────────────────

export type InspectionType = "pre_rental" | "post_rental";

export interface InspectionInfo {
  id: string;
  type: InspectionType;
  odometer: number;
  fuelLevel: number;
  photos: string[];
  damageNotes: string | null;
  conductedAt: string;
}

// ─── Notification ──────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}
