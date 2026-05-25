export enum AgreementStatus {
  /** Agreement not yet sent to renter (draft or not created) */
  NotSent = "not_sent",
  /** Agreement sent to renter, awaiting signature */
  Sent = "sent",
  /** Agreement viewed by renter (optional intermediate) */
  Viewed = "viewed",
  /** Agreement signed by renter */
  Signed = "signed",
  /** Legacy alias for NotSent */
  Draft = "draft",
  /** Agreement link expired */
  Expired = "expired",
}

export const AGREEMENT_STATUS_LABELS: Record<AgreementStatus, string> = {
  [AgreementStatus.NotSent]: "Not Sent",
  [AgreementStatus.Sent]: "Sent",
  [AgreementStatus.Viewed]: "Viewed",
  [AgreementStatus.Signed]: "Signed",
  [AgreementStatus.Draft]: "Draft",
  [AgreementStatus.Expired]: "Expired",
};

export interface RentalAgreement {
  id: string;
  reservationId: string;
  renterName: string;
  vehicleDisplayName: string;
  status: AgreementStatus;
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  createdAt: string;
}
