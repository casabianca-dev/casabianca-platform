// app/api/admin/menu/add-item/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryId, name, description, priceDollars } = body;

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const priceNumber = Number(priceDollars);
    if (isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json(
        { error: "priceDollars must be a non-negative number" },
        { status: 400 }
      );
    }

    const priceCents = Math.round(priceNumber * 100);

    await prisma.menuItem.create({
      data: {
        categoryId,
        name,
        description: description || null,
        basePriceCents: priceCents,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
