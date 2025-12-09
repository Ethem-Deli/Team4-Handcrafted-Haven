import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params; //MUST AWAIT

  const id = Number(productId);

  if (isNaN(id)) {
    return NextResponse.json({ reviews: [] });
  }

  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}