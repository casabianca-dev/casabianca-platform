// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Upsert main restaurant + first location
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "casa-bianca" },
    update: {},
    create: {
      name: "Casa Bianca Pizza",
      slug: "casa-bianca",
      brandColor: "#D30000",
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

  // Get Wallingford location
  let wallingford = restaurant.locations.find(
    (loc) => loc.slug === "wallingford"
  );

  if (!wallingford) {
    wallingford = await prisma.location.findFirst({
      where: { slug: "wallingford" },
    });
  }

  if (!wallingford) {
    throw new Error("Wallingford location not found");
  }

  console.log("Restaurant + location ready:", {
    restaurant: restaurant.name,
    location: wallingford.name,
  });

  // Simple seed categories + items for Wallingford
  const categoriesData = [
    {
      name: "Specialty Pizzas",
      sortOrder: 1,
      items: [
        {
          name: "Chicken Bacon Ranch",
          description:
            "Grilled chicken, crispy bacon, mozzarella, and creamy ranch drizzle.",
          basePriceCents: 1899,
        },
        {
          name: "Casa Bianca Works Pizza",
          description:
            "Pepperoni, bacon, sausage, meatballs, mushrooms, onions, olives, peppers, mozzarella.",
          basePriceCents: 2099,
        },
      ],
    },
    {
      name: "Chicken Pizzas",
      sortOrder: 2,
      items: [
        {
          name: "BBQ Chicken Pizza",
          description:
            "Smoky BBQ chicken, mozzarella, and red onions on a BBQ sauce base.",
          basePriceCents: 1899,
        },
        {
          name: "Buffalo Chicken Pizza",
          description:
            "Spicy buffalo chicken, mozzarella, and a choice of ranch or bleu cheese drizzle.",
          basePriceCents: 1899,
        },
      ],
    },
    {
      name: "Classics",
      sortOrder: 3,
      items: [
        {
          name: "Margherita Classic Pizza (Red or White)",
          description:
            "Fresh tomatoes, garlic, basil, and mozzarella on your choice of red or white sauce.",
          basePriceCents: 1699,
        },
      ],
    },
  ];

  for (const categoryData of categoriesData) {
    // Check if category already exists
    let category = await prisma.menuCategory.findFirst({
      where: {
        locationId: wallingford.id,
        name: categoryData.name,
      },
    });

    if (!category) {
      category = await prisma.menuCategory.create({
        data: {
          locationId: wallingford.id,
          name: categoryData.name,
          sortOrder: categoryData.sortOrder,
        },
      });
      console.log("Created category:", category.name);
    } else {
      console.log("Category already exists:", category.name);
    }

    // For each item, create if it doesn't exist
    for (const item of categoryData.items) {
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          categoryId: category.id,
          name: item.name,
        },
      });

      if (!existingItem) {
        await prisma.menuItem.create({
          data: {
            categoryId: category.id,
            name: item.name,
            description: item.description,
            basePriceCents: item.basePriceCents,
            isActive: true,
          },
        });
        console.log(`  Created item: ${item.name}`);
      } else {
        console.log(`  Item already exists: ${item.name}`);
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
