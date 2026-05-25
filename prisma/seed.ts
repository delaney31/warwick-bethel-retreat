import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Optional dev seed — run with: npx prisma db seed
 * Requires DATABASE_URL. Does not run in production deploys unless invoked manually.
 */
async function main() {
  const existing = await prisma.reservation.count();
  if (existing > 0) {
    console.log("Seed skipped — reservations already exist.");
    return;
  }

  await prisma.reservation.create({
    data: {
      guestName: "Sample Guest",
      email: "guest@example.com",
      phone: "5551234567",
      roomPackage: "MAIN_BEDROOM",
      guestCount: 2,
      checkIn: new Date("2026-07-01"),
      checkOut: new Date("2026-07-03"),
      nights: 2,
      baseRate: 150,
      extraGuestFee: 0,
      totalAmount: 300,
      status: ReservationStatus.PENDING_REVIEW,
      notes: "Dev seed reservation",
    },
  });

  console.log("Seeded sample PENDING_REVIEW reservation.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
