// app/admin/page.tsx
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      locations: true,
    },
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
        Admin Dashboard
      </h1>

      <p style={{ marginBottom: "1.5rem" }}>
        This is your internal view. Later we&apos;ll add menu editing, orders,
        and more.
      </p>

      {restaurants.length === 0 && <p>No restaurants found in the database.</p>}

      {restaurants.map((restaurant) => (
        <section
          key={restaurant.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
            {restaurant.name} ({restaurant.slug})
          </h2>

          <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
            Locations:
          </h3>
          <ul style={{ marginLeft: "1.25rem" }}>
            {restaurant.locations.map((loc) => (
              <li key={loc.id}>
                <strong>{loc.name}</strong> — {loc.city}, {loc.state}{" "}
                ({loc.slug})
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
