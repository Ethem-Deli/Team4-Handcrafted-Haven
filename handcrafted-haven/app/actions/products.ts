"use server";

import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const filePath = path.join(process.cwd(), "data", "seller-products.json");

// Load JSON file
function loadProducts() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Save to JSON file
function saveProducts(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ADD PRODUCT //
export async function addProduct(formData: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) throw new Error("Not logged in");

  const user = JSON.parse(session.value);
  if (user.role !== "seller") throw new Error("Unauthorized");

  const db = loadProducts();

  const newProduct = {
    id: Date.now(),
    sellerId: user.id,
    name: formData.name,
    price: parseFloat(formData.price),
    category: formData.category,
    image: formData.image,
    description: formData.description,
  };

  db.products.push(newProduct);
  saveProducts(db);

  return { success: true };
}

// DELETE PRODUCT //
export async function deleteProduct(id: number) {
  const db = loadProducts();

  db.products = db.products.filter((p: any) => p.id !== id);

  saveProducts(db);
  return { success: true };
}

// EDIT PRODUCT //
export async function editProduct(updatedProduct: any) {
  const db = loadProducts();

  const index = db.products.findIndex((p: any) => p.id === updatedProduct.id);
  if (index === -1) throw new Error("Product not found");

  db.products[index] = updatedProduct;
  saveProducts(db);

  return { success: true };
}
