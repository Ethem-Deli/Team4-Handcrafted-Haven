"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type DbCartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string | null;
  };
};

type GuestCartItem = {
  productId: number;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type UnifiedItem = {
  productId: number;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart depending on login status
  useEffect(() => {
    async function load() {
      setLoading(true);

      // Logged-in: load from API
      if (status === "authenticated") {
        const res = await fetch("/api/cart");
        const data = await res.json();
        const dbItems = (data.items || []) as DbCartItem[];

        const mapped: UnifiedItem[] = dbItems.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          image: i.product.image,
          quantity: i.quantity,
        }));

        setItems(mapped);
        setLoading(false);
        return;
      }

      // Guest: load from localStorage
      if (status === "unauthenticated") {
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("guest-cart") || "[]";
          const guestItems = JSON.parse(raw) as GuestCartItem[];
          setItems(
            guestItems.map((g) => ({
              productId: g.productId,
              title: g.title,
              price: g.price,
              image: g.image,
              quantity: g.quantity,
            }))
          );
        }
        setLoading(false);
      }
    }

    load();
  }, [status]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function changeQuantity(productId: number, newQty: number) {
    // Guest
    if (status === "unauthenticated") {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("guest-cart") || "[]";
      let guestItems = JSON.parse(raw) as GuestCartItem[];

      if (newQty <= 0) {
        guestItems = guestItems.filter((g) => g.productId !== productId);
      } else {
        guestItems = guestItems.map((g) =>
          g.productId === productId ? { ...g, quantity: newQty } : g
        );
      }

      localStorage.setItem("guest-cart", JSON.stringify(guestItems));
      setItems(
        guestItems.map((g) => ({
          productId: g.productId,
          title: g.title,
          price: g.price,
          image: g.image,
          quantity: g.quantity,
        }))
      );
      return;
    }

    // Logged-in
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: newQty }),
    });

    // reload
    const res = await fetch("/api/cart");
    const data = await res.json();
    const dbItems = (data.items || []) as DbCartItem[];
    setItems(
      dbItems.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        image: i.product.image,
        quantity: i.quantity,
      }))
    );
  }

  async function removeItem(productId: number) {
    await changeQuantity(productId, 0);
  }

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 items-center bg-white p-4 rounded shadow"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h2 className="font-semibold">{item.title}</h2>
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
              <p className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>

        {/* Checkout button – protected by login */}
        <a
          href={
            status === "authenticated"
              ? "/checkout"
              : "/auth/signin?callbackUrl=/checkout"
          }
        >
          <button className="mt-4 bg-gray-800 text-white px-5 py-2 rounded">
            Proceed to Checkout
          </button>
        </a>
      </div>
    </div>
  );
}
