import { api } from "./client";
import { getApiBaseUrl } from "./config";
import { ApiError } from "./errors";
import { getReservations } from "./reservations";
import {
  DocumentSlot,
  DocumentStatus,
  type RenterDocument,
} from "@/types/document";

/** Matches backend DriverDocumentDto (camelCase JSON). */
export interface DriverDocumentDto {
  id: string;
  reservationId: string;
  documentType: string;
  status: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  reviewNote: string | null;
  reviewedAtUtc: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

const API_DOC_TYPE_TO_SLOT: Record<string, DocumentSlot> = {
  LicenseFront: DocumentSlot.DriversLicenseFront,
  LicenseBack: DocumentSlot.DriversLicenseBack,
  Selfie: DocumentSlot.Selfie,
  Insurance: DocumentSlot.ProofOfInsurance,
};

const SLOT_TO_API_DOC_TYPE: Record<DocumentSlot, string> = {
  [DocumentSlot.DriversLicenseFront]: "LicenseFront",
  [DocumentSlot.DriversLicenseBack]: "LicenseBack",
  [DocumentSlot.Selfie]: "Selfie",
  [DocumentSlot.ProofOfInsurance]: "Insurance",
};

const API_STATUS_TO_UI: Record<string, DocumentStatus> = {
  Pending: DocumentStatus.Pending,
  Approved: DocumentStatus.Approved,
  Rejected: DocumentStatus.Rejected,
  NeedsReplacement: DocumentStatus.NeedsReplacement,
};

const UI_STATUS_TO_API: Record<DocumentStatus, string> = {
  [DocumentStatus.Pending]: "Pending",
  [DocumentStatus.Approved]: "Approved",
  [DocumentStatus.Rejected]: "Rejected",
  [DocumentStatus.NeedsReplacement]: "NeedsReplacement",
};

export function mapDriverDocumentDtoToRenter(
  dto: DriverDocumentDto,
  renterName: string,
): RenterDocument {
  const slot =
    API_DOC_TYPE_TO_SLOT[dto.documentType] ?? DocumentSlot.DriversLicenseFront;
  const status =
    API_STATUS_TO_UI[dto.status] ?? DocumentStatus.Pending;

  return {
    id: dto.id,
    reservationId: dto.reservationId,
    renterName,
    slot,
    status,
    fileName: dto.originalFileName,
    fileSize: dto.sizeBytes,
    mimeType: dto.contentType,
    uploadedAt: dto.createdAtUtc,
    reviewedAt: dto.reviewedAtUtc,
    reviewNote: dto.reviewNote,
  };
}

/**
 * Public: multipart upload (no JWT). documentType matches backend enum names.
 */
export async function uploadReservationDocument(
  reservationId: string,
  slot: DocumentSlot,
  file: File,
  signal?: AbortSignal,
): Promise<DriverDocumentDto> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const form = new FormData();
  form.append("documentType", SLOT_TO_API_DOC_TYPE[slot]);
  form.append("file", file, file.name);

  const res = await fetch(`${base}/reservations/${reservationId}/documents`, {
    method: "POST",
    body: form,
    signal,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText, body);
  }

  return body as DriverDocumentDto;
}

/** Admin: list documents for a reservation. */
export async function listAdminReservationDocuments(
  reservationId: string,
  signal?: AbortSignal,
): Promise<DriverDocumentDto[]> {
  return api.get<DriverDocumentDto[]>(
    `/admin/reservations/${reservationId}/documents`,
    { signal },
  );
}

export interface PatchDocumentStatusBody {
  status: DocumentStatus;
  reviewNote?: string | null;
}

/** Admin: update review status. */
export async function patchAdminDocumentStatus(
  documentId: string,
  body: PatchDocumentStatusBody,
  signal?: AbortSignal,
): Promise<DriverDocumentDto> {
  const payload = {
    status: UI_STATUS_TO_API[body.status],
    reviewNote: body.reviewNote ?? null,
  };
  return api.patch<DriverDocumentDto>(
    `/admin/documents/${documentId}/status`,
    payload,
    { signal },
  );
}

/**
 * Admin: all documents across reservations (for /admin/documents).
 * Merges reservation list with per-reservation document lists.
 */
export async function fetchAllAdminDocumentsWithRenters(
  signal?: AbortSignal,
): Promise<RenterDocument[]> {
  const reservations = await getReservations(undefined, { signal });
  const results = await Promise.all(
    reservations.map(async (r) => {
      try {
        const dtos = await listAdminReservationDocuments(r.id, signal);
        return dtos.map((d) => mapDriverDocumentDtoToRenter(d, r.renterName));
      } catch {
        return [];
      }
    }),
  );
  return results.flat();
}
