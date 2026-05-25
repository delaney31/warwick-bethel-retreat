/**
 * Availability types matching backend DTOs.
 */

export interface DateRange {
  start: string;
  end: string;
}

export interface AvailabilityBlock {
  id: string;
  vehicleId: string;
  startDateUtc: string;
  endDateUtc: string;
  reason: string;
  notes: string | null;
  createdAtUtc: string;
}

export interface VehicleAvailability {
  vehicleId: string;
  fromDate: string | null;
  toDate: string | null;
  blocks: AvailabilityBlock[];
  blockedRanges: DateRange[];
}

export interface AvailabilityCheck {
  vehicleId: string;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  reason: string | null;
}

export interface CreateAvailabilityBlockRequest {
  vehicleId: string;
  startDateUtc: string;
  endDateUtc: string;
  reason: string;
  notes?: string | null;
}
