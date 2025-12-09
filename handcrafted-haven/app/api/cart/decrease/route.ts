import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const itemId = Number(formData.get("itemId"));

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (item && item.quantity > 1) {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: { decrement: 1 } },
    });
  } else {
    await prisma.cartItem.delete({ where: { id: itemId } });
  }

  return NextResponse.redirect("/cart");
}
