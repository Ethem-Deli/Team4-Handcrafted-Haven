import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ count: 0 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ count: 0 });

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    return NextResponse.json({
      count: cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    });

  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
