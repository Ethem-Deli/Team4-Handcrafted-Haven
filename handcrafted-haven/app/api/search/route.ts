import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json({ products: [], sellers: [] });

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } }
        ]
      },
      include: {
        category: true,
        user: { select: { storeName: true, name: true } }
      },
      take: 30
    });

    const sellers = await prisma.user.findMany({
      where: {
        role: "SELLER",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { storeName: { contains: q, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        storeName: true,
        craftDescription: true
      },
      take: 20
    });

    return NextResponse.json({ products, sellers });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results." },
      { status: 500 }
    );
  }
}
