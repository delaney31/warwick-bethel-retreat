-- Run with: sqlite3 pacific_luxe.db < scripts/apply-migration.sql
-- Stop the API first to release the database lock.

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT NOT NULL PRIMARY KEY,
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  daily_rate REAL NOT NULL,
  included_miles_per_day INTEGER NOT NULL,
  location_city TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT,
  created_at_utc TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS IX_vehicles_slug ON vehicles(slug);
CREATE INDEX IF NOT EXISTS IX_vehicles_status ON vehicles(status);

CREATE TABLE IF NOT EXISTS availability_blocks (
  id TEXT NOT NULL PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  start_date_utc TEXT NOT NULL,
  end_date_utc TEXT NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  created_at_utc TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
CREATE INDEX IF NOT EXISTS IX_availability_blocks_vehicle_id ON availability_blocks(vehicle_id);
CREATE INDEX IF NOT EXISTS IX_availability_blocks_start_date_utc ON availability_blocks(start_date_utc);
CREATE INDEX IF NOT EXISTS IX_availability_blocks_end_date_utc ON availability_blocks(end_date_utc);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT NOT NULL PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  renter_name TEXT NOT NULL,
  renter_email TEXT NOT NULL,
  renter_phone TEXT NOT NULL,
  start_date_utc TEXT NOT NULL,
  end_date_utc TEXT NOT NULL,
  pickup_preference TEXT NOT NULL,
  driver_age INTEGER NOT NULL,
  notes TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at_utc TEXT NOT NULL,
  updated_at_utc TEXT NOT NULL,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
CREATE INDEX IF NOT EXISTS IX_reservations_vehicle_id ON reservations(vehicle_id);
CREATE INDEX IF NOT EXISTS IX_reservations_start_date_utc ON reservations(start_date_utc);
CREATE INDEX IF NOT EXISTS IX_reservations_end_date_utc ON reservations(end_date_utc);
CREATE INDEX IF NOT EXISTS IX_reservations_status ON reservations(status);

INSERT OR IGNORE INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES ('20250320010000_InitialCreate', '8.0.11');
