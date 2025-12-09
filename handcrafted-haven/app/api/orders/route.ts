import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Order items from frontend */
type OrderItemInput = {
  productId: number;
  quantity: number;
};

/** Minimal Product shape */
type ProductType = {
  id: number;
  stock: number;
  title: string;
  price: number;
};

export async function POST(req: NextRequest) {
  try {
    // Session check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const buyerId = Number((session.user as any).id);

    // Parse request body
    const body = await req.json();
    const { items } = body as { items: OrderItemInput[] };

    if (!items || !items.length) {
      return NextResponse.json({ message: "No items in order" }, { status: 400 });
    }

    // Products requested
    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    // Validate product existence
    if (products.length !== items.length) {
      return NextResponse.json(
        { message: "One or more products not found" },
        { status: 400 }
      );
    }

    // Validate stock BEFORE creating
    for (const item of items) {
      const product = products.find(
        (p: ProductType) => p.id === item.productId
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

    // ➤ Create order + items + reduce stock in 1 atomic step
    const createdOrder = await prisma.$transaction(async (tx: any) => {
      // Create order entry
      const order = await tx.order.create({
        data: { buyerId, status: "PENDING" }
      });

      // Insert items + update stock
      for (const item of items) {
        const product = products.find(
          (p: ProductType) => p.id === item.productId
        ) as ProductType;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price
          }
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });
      }

      return order;
    });

    return NextResponse.json({ orderId: createdOrder.id }, { status: 201 });

  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "Server error", error: error?.message },
      { status: 500 }
    );
  }
}
