import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const minPrice = parseFloat(searchParams.get("minPrice") ?? "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") ?? "100000");
  const sort = searchParams.get("sort") ?? "popular";
  const search = searchParams.get("search") ?? "";

  const products = await prisma.product.findMany({
    where: {
      categoryId: categoryId ? Number(categoryId) : undefined,
      price: { gte: minPrice, lte: maxPrice },
      title: search ? { contains: search, mode: "insensitive" } : undefined,
    },
    include: {
      _count: { select: { orderItems: true } },
      category: true,
      reviews: true,
    },
  });

  const enriched = products.map((p) => ({
    ...p,
    avgRating: p.reviews.length
      ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length
      : 0,
  }));

  if (sort === "popular") {
    enriched.sort(
      (a, b) => (b._count.orderItems ?? 0) - (a._count.orderItems ?? 0)
    );
  } else if (sort === "price-asc") {
    enriched.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    enriched.sort((a, b) => b.price - a.price);
  }

  return NextResponse.json({ products: enriched });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = (session.user as any).id;
  const body = await req.json();
  const { title, description, price, image, stock, categoryId } = body;

  if (!title || !price) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      image: image ?? null,
      stock: stock ? Number(stock) : 0,
      userId: sellerId,
      categoryId: categoryId ? Number(categoryId) : null,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}