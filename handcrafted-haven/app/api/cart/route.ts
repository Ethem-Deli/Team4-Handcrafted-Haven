import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

//  Get user ID from NextAuth
async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user ? (session.user as any).id : null;
}

//  GET CART
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ cart: [] });

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ cart: cart?.items ?? [] });
}

//  POST (Add to cart)
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ guest: true }); // will use localStorage

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: 1 },
    });
  }

  return NextResponse.json({ success: true });
}

//  PUT (Change quantity)
export async function PUT(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || quantity == null) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId },
      data: { quantity },
    });
  }

  return NextResponse.json({ success: true });
}

//  DELETE (Remove Item)
export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  return NextResponse.json({ success: true });
}
