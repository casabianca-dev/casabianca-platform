// app/admin/menu/EditPriceForm.tsx
"use client";

import { useState } from "react";

type EditPriceFormProps = {
  itemId: string;
  initialPriceCents: number;
};

export function EditPriceForm({ itemId, initialPriceCents }: EditPriceFormProps) {
  const [price, setPrice] = useState((initialPriceCents / 100).toFixed(2));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const priceNumber = parseFloat(price);

    if (isNaN(priceNumber) || priceNumber < 0) {
      setMessage("Please enter a valid price.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/menu/update-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          priceDollars: priceNumber,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to update price.");
      } else {
        setMessage("Saved.");
        // simple approach: reload page to show updated values
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        type="number"
        step="0.01"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{
          width: "5rem",
          padding: "0.25rem 0.4rem",
          borderRadius: "0.25rem",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        disabled={isSaving}
        style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "0.25rem",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      {message && (
        <span style={{ fontSize: "0.8rem", color: "#555" }}>{message}</span>
      )}
    </form>
  );
}
