import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const buyerId = (session.user as any).id;
  const body = await req.json();
  const { items } = body as { items: { productId: number; quantity: number }[] };

  if (!items?.length) {
    return NextResponse.json({ message: "No items in order" }, { status: 400 });
  }

  const productIds = items.map(i => i.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ message: "One or more products not found" }, { status: 400 });
  }

  for (const item of items) {
    const product = products.find(p => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { message: `Not enough stock for ${product.title}` },
        { status: 400 }
      );
    }
  }

  const order = await prisma.$transaction(async tx => {
    const createdOrder = await tx.order.create({
      data: {
        buyerId,
        status: "PENDING",
      },
    });

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)!;

      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: product.stock - item.quantity },
      });
    }

    return createdOrder;
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}