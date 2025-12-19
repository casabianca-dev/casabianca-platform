// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Upsert main restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "casa-bianca" },
    update: {},
    create: {
      name: "Casa Bianca Pizza",
      slug: "casa-bianca",
      brandColor: "#D30000", // you can change later
      locations: {
        create: {
          name: "Casa Bianca Wallingford",
          slug: "wallingford",
          addressLine1: "123 Example St",
          city: "Wallingford",
          state: "CT",
          postalCode: "06492",
          phone: "000-000-0000",
          supportsPickup: true,
          supportsDelivery: true,
        },
      },
    },
    include: {
      locations: true,
    },
  });

  console.log("Seeded restaurant + location:");
  console.log({
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    locations: restaurant.locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
    })),
  });
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
