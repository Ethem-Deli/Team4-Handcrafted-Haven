import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { productId, rating, comment } = await req.json();
    // Validate input 
  if (!productId || !rating) {
    return NextResponse.json({ message: "Missing product or rating" }, { status: 400 });
  }

  //To Prevent same user reviewing the same product multiple times
  const existing = await prisma.review.findFirst({
    where: { userId, productId }
  });

  if (existing) {
    return NextResponse.json({ message: "You already reviewed this product." }, { status: 409 });
  }

  await prisma.review.create({
    data: {
      rating: Number(rating),
      comment: comment || "",
      userId,
      productId,
    }
  });

  return NextResponse.json({ success: true });
}