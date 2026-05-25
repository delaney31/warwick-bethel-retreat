-- CreateEnum
CREATE TYPE "RoomPackage" AS ENUM ('MAIN_BEDROOM', 'TWO_BEDROOMS');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "roomPackage" "RoomPackage" NOT NULL DEFAULT 'MAIN_BEDROOM';
