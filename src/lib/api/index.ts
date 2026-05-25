/**
 * API client layer — feature modules and shared utilities.
 */

export { api, ApiError } from "./client";
export { getApiBaseUrl, isLoopbackUrl } from "./config";
export {
  resolvePublicApiBaseUrl,
  resolveBackendOriginForRewrites,
  tryNormalizeApiBase,
} from "./resolve-api-url";
export {
  ApiConfigurationError,
  isApiError,
  getApiErrorMessage,
} from "./errors";

export {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  loginAdmin,
} from "../auth";
export type { AdminLoginResponse } from "../auth";

export * from "./vehicles";
export * from "./availability";
export * from "./reservations";
export * from "./documents";
export * from "./agreements";
export * from "./payments";
export * from "./operations";

export type { VehicleSummary, VehicleDetail } from "./types/vehicle";
export type {
  VehicleAvailability,
  AvailabilityCheck,
  AvailabilityBlock,
  DateRange,
  CreateAvailabilityBlockRequest,
} from "./types/availability";
export type {
  CreateReservationRequest,
  ReservationCreated,
  ReservationSummary,
  ReservationDetail,
  UpdateReservationStatusRequest,
  PickupPreference,
  ReservationStatus,
} from "./types/reservation";
