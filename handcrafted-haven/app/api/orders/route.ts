import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  productId: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const buyerId = (session.user as any).id;

    const body = await req.json();
    const { items } = body as { items: OrderItemInput[] };

    if (!items || !items.length) {
      return NextResponse.json(
        { message: "No items in order" },
        { status: 400 }
      );
    }

    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { message: "One or more products not found" },
        { status: 400 }
      );
    }

    // Verify stock before transaction
    for (const item of items) {
      const product = products.find(
        (p: { id: number }) => p.id === item.productId
      );
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Not enough stock for ${product.title}` },
          { status: 400 }
        );
      }
    }
    const order = await prisma.$transaction(async (tx) => {
  const createdOrder = await tx.order.create({
    data: {
      buyerId,
      status: "PENDING",
    },
  });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;

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
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Server error", error: error?.message },
      { status: 500 }
    );
  } 
}