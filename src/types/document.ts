export enum DocumentSlot {
  DriversLicenseFront = "drivers_license_front",
  DriversLicenseBack = "drivers_license_back",
  Selfie = "selfie",
  ProofOfInsurance = "proof_of_insurance",
}

export const DOCUMENT_SLOT_LABELS: Record<DocumentSlot, string> = {
  [DocumentSlot.DriversLicenseFront]: "Driver's License (Front)",
  [DocumentSlot.DriversLicenseBack]: "Driver's License (Back)",
  [DocumentSlot.Selfie]: "Selfie with ID",
  [DocumentSlot.ProofOfInsurance]: "Proof of Insurance",
};

export const DOCUMENT_SLOT_DESCRIPTIONS: Record<DocumentSlot, string> = {
  [DocumentSlot.DriversLicenseFront]:
    "Clear photo of the front of your valid driver's license",
  [DocumentSlot.DriversLicenseBack]:
    "Clear photo of the back of your driver's license",
  [DocumentSlot.Selfie]:
    "A selfie holding your driver's license next to your face",
  [DocumentSlot.ProofOfInsurance]:
    "Your insurance declaration page or proof of full coverage",
};

export const ALL_DOCUMENT_SLOTS: DocumentSlot[] = [
  DocumentSlot.DriversLicenseFront,
  DocumentSlot.DriversLicenseBack,
  DocumentSlot.Selfie,
  DocumentSlot.ProofOfInsurance,
];

export enum DocumentStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  NeedsReplacement = "needs_replacement",
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.Pending]: "Pending Review",
  [DocumentStatus.Approved]: "Approved",
  [DocumentStatus.Rejected]: "Rejected",
  [DocumentStatus.NeedsReplacement]: "Needs Replacement",
};

export interface RenterDocument {
  id: string;
  reservationId: string;
  renterName: string;
  slot: DocumentSlot;
  status: DocumentStatus;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
}
