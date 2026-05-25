-- Idempotent insert for 2023 BMW X7 (run against production Postgres if API has not restarted yet).
INSERT INTO vehicles (
  id, slug, display_name, year, make, model, trim, daily_rate, included_miles_per_day,
  location_city, status, description, hero_image, created_at_utc, updated_at_utc
)
SELECT
  'a1111111-1111-1111-1111-111111111105'::uuid,
  'bmw-x7-xdrive40i',
  '2023 BMW X7 xDrive40i',
  2023,
  'BMW',
  'X7 xDrive40i',
  NULL,
  595,
  100,
  'Santa Monica, CA',
  'Available',
  'A full-size luxury SUV with six-passenger captain''s chair seating, BMW xDrive all-wheel drive, and a refined cabin with the latest curved display and premium materials. Ideal for families, group trips, and clients who want SUV space with first-class comfort in Los Angeles.',
  '/images/vehicles/bmw-x7-xdrive40i/hero.png',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM vehicles WHERE slug = 'bmw-x7-xdrive40i'
);
