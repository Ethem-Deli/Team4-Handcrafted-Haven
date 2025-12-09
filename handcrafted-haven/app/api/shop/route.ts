import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Queries
    const q = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "none";
    const page = Number(searchParams.get("page")) || 1;
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 99999;

    const pageSize = 12; // 12 per page

    let whereClause: any = {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category !== "all") {
      whereClause.category = { name: category };
    }

    let orderByClause: any | undefined = undefined;
    if (sort === "low") orderByClause = { price: "asc" };
    if (sort === "high") orderByClause = { price: "desc" };

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true, user: true },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error("Shop API Error:", error);
    return NextResponse.json({ error: "Failed to load shop" }, { status: 500 });
  }
}
