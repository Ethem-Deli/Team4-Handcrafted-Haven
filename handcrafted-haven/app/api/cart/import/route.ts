// app/api/cart/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { items } = await req.json() as {
    items: { productId: number; quantity: number }[];
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: true });
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Merge each guest item into DB cart
  for (const item of items) {
    if (!item.productId || item.quantity <= 0) continue;

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: item.productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
