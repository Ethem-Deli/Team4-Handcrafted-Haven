import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "cart.json");

function readCart() {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}
function writeCart(json: any) {
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

export async function GET() {
  const json = readCart();
  return new Response(JSON.stringify(json), { headers: { "Content-Type": "application/json" } });
}

/**
 * POST -> add item to cart
 * body: { userId, product }  (product contains id, name, price, image)
 *
 * PUT -> update quantity
 * body: { userId, productId, quantity }
 *
 * DELETE -> remove cart item
 * body: { userId, productId }
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { userId, product } = body;
  if (!userId || !product) return new Response("Bad Request", { status: 400 });

  const json = readCart();

  const existing = json.cart.find((c: any) => c.userId === userId && c.productId === product.id);
  if (existing) existing.quantity += 1;
  else {
    json.cart.push({
      userId,
      productId: product.id,
      name: product.name,
      price: Number(product.price || 0),
      image: product.image || "",
      quantity: 1
    });
  }

  writeCart(json);
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { userId, productId, quantity } = body;
  if (!userId || !productId || typeof quantity !== "number") return new Response("Bad Request", { status: 400 });

  const json = readCart();
  const item = json.cart.find((c: any) => c.userId === userId && c.productId === productId);
  if (!item) return new Response("Not Found", { status: 404 });

  if (quantity <= 0) {
    json.cart = json.cart.filter((c: any) => !(c.userId === userId && c.productId === productId));
  } else {
    item.quantity = quantity;
  }

  writeCart(json);
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { userId, productId } = body;
  if (!userId || !productId) return new Response("Bad Request", { status: 400 });

  const json = readCart();
  json.cart = json.cart.filter((c: any) => !(c.userId === userId && c.productId === productId));
  writeCart(json);
  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
}
