import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const itemId = Number(formData.get("itemId"));

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: { increment: 1 } },
  });

  return NextResponse.redirect("/cart");
}
