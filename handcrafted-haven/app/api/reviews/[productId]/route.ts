import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { productId: string } }) {
  const reviews = await prisma.review.findMany({
    where: { productId: Number(params.productId) },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ reviews });
}
