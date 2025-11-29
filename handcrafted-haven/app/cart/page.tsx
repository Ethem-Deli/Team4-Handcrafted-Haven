"use client";

import { useEffect, useState } from "react";

type CartItem = {
  userId: number;
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  const userId = user?.id;

  async function loadCart() {
    setLoading(true);
    const res = await fetch("/api/cart");
    const data = await res.json();
    const userCart = data.cart.filter((c: any) => c.userId === userId);
    setItems(userCart);
    setLoading(false);
  }

  useEffect(() => {
    if (!userId) return;
    loadCart();
  }, [userId]);

  async function changeQuantity(productId: number, newQty: number) {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity: newQty }),
    });
    await loadCart();
  }

  async function removeItem(productId: number) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });
    await loadCart();
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!userId) {
    return <div className="p-10">Please <a href="/login" className="text-blue-600 underline">login</a> to see your cart.</div>;
  }

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {loading ? <p>Loading...</p> : null}

      {items.length === 0 && !loading && <p>Your cart is empty.</p>}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-center bg-white p-4 rounded shadow">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            )}
            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>

                <span className="px-3">{item.quantity}</span>

                <button
                  onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-4 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <button className="mt-4 bg-gray-800 text-white px-5 py-2 rounded">Proceed to Checkout</button>
      </div>
    </div>
  );
}
