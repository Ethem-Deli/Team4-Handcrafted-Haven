"use server";

import fs from "fs";
import path from "path";

export async function addToCart(userId: number, product: any) {
  const filePath = path.join(process.cwd(), "data", "cart.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Check if item already exists in cart then add 1 more in qty
  const existing = json.cart.find(
    (item: any) => item.userId === userId && item.productId === product.id
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    json.cart.push({
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

  return { success: true };
}
