// app/admin/menu/AddItemForm.tsx
"use client";

import { useState } from "react";

type AddItemFormProps = {
  categoryId: string;
};

export function AddItemForm({ categoryId }: AddItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const priceNumber = parseFloat(price);

    if (!name.trim()) {
      setMessage("Name is required.");
      setIsSaving(false);
      return;
    }

    if (isNaN(priceNumber) || priceNumber < 0) {
      setMessage("Please enter a valid price.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/menu/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          name: name.trim(),
          description: description.trim() || null,
          priceDollars: priceNumber,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to add item.");
      } else {
        // Simple: reload to show the new item
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
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "0.75rem",
        paddingTop: "0.75rem",
        borderTop: "1px dashed #ddd",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>Add new item</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.85rem" }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "0.35rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.85rem" }}>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          style={{
            padding: "0.35rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <label style={{ fontSize: "0.85rem" }}>Price ($)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            width: "6rem",
            padding: "0.35rem 0.5rem",
            borderRadius: "0.25rem",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: "0.35rem 0.9rem",
            borderRadius: "0.25rem",
            border: "none",
            backgroundColor: "#16a34a",
            color: "white",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {isSaving ? "Saving..." : "Add Item"}
        </button>
        {message && (
          <span style={{ fontSize: "0.8rem", color: "#555" }}>{message}</span>
        )}
      </div>
    </form>
  );
}
