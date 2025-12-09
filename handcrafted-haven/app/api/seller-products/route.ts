import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const sellerId = (session.user as any).id;

  const products = await prisma.product.findMany({
    where: { userId: sellerId },
  });

  return NextResponse.json({ products });
}