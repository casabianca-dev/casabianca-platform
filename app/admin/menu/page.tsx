// app/admin/menu/page.tsx
import { EditPriceForm } from "./EditPriceForm";
import { prisma } from "@/lib/prisma";

export default async function AdminMenuPage() {
  const location = await prisma.location.findFirst({
    where: { slug: "wallingford" }, // later we'll make this dynamic
    include: {
      menuCategories: {
        orderBy: { sortOrder: "asc" },
        include: {
          items: {
            orderBy: { name: "asc" },
          },
        },
      },
      restaurant: true,
    },
  });

  if (!location) {
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, -apple-system" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Admin Menu
        </h1>
        <p>Location &quot;wallingford&quot; not found in the database.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, -apple-system" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Menu – {location.restaurant.name}
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Location: <strong>{location.name}</strong> ({location.city},{" "}
        {location.state})
      </p>

      {location.menuCategories.length === 0 && (
        <p>No menu categories found yet for this location.</p>
      )}

      {location.menuCategories.map((cat) => (
        <section
          key={cat.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            {cat.name}
          </h2>

          {cat.items.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#777" }}>
              No items in this category yet.
            </p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {cat.items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            marginTop: "0.2rem",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <EditPriceForm
                        itemId={item.id}
                        initialPriceCents={item.basePriceCents}
                        />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
