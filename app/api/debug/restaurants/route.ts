// app/api/debug/restaurants/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    include: { locations: true },
  });

  return NextResponse.json(restaurants);
}
