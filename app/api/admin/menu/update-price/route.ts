// app/api/admin/menu/update-price/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, priceDollars } = body;

    if (!itemId || typeof priceDollars !== "number" || isNaN(priceDollars)) {
      return NextResponse.json(
        { error: "Invalid itemId or priceDollars" },
        { status: 400 }
      );
    }

    const priceCents = Math.round(priceDollars * 100);

    await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        basePriceCents: priceCents,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating price:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
