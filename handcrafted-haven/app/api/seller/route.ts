import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: "SELLER" },
      select: {
        id: true,
        name: true,
        email: true,
        storeName: true,
        craftDescription: true,
      },
    });

    return NextResponse.json({ sellers });
  } catch (error) {
    console.error("Failed to load sellers:", error);
    return NextResponse.json({ sellers: [] }, { status: 500 });
  }
}
