import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });

  await prisma.review.create({
    data: {
      productId,
      rating,
      comment,
      userId: Number(session.user.id),
    },
  });

  return NextResponse.json({ success: true });
}
