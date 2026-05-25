/**
 * Vehicle types matching backend VehicleSummaryDto / VehicleDetailDto.
 */

export interface VehicleSummary {
  id: string;
  slug: string;
  displayName: string;
  year: number;
  make: string;
  model: string;
  dailyRate: number;
  includedMilesPerDay: number;
  locationCity: string;
  status: string;
  heroImage: string | null;
}

export interface VehicleDetail extends VehicleSummary {
  trim: string | null;
  description: string;
}
