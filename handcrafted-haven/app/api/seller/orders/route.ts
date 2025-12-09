import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "SELLER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sellerId = (session.user as any).id;

  // Orders that contain at least one product from this seller
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            userId: sellerId,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: true,
      items: {
        include: { product: true },
      },
    },
  });

  return NextResponse.json({ orders });
}