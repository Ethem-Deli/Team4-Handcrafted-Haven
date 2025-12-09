import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const itemId = Number(formData.get("itemId"));

  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.redirect("/cart");
}
