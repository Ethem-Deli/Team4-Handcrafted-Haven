"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  async function loadCount() {
    const user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    if (!user) {
      setCount(0);
      return;
    }

    const res = await fetch("/api/cart");
    const data = await res.json();

    const my = data.cart.filter((c: any) => c.userId === user.id);
    const total = my.reduce((s: number, i: any) => s + i.quantity, 0);

    setCount(total);
  }

  useEffect(() => {
    loadCount();
    const id = setInterval(loadCount, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link href="/cart" className="relative inline-block">
      {/* upload the SVG icon here if need to change */}
      <Image
        src="/icons/cart.svg"
        alt="Cart"
        width={32}
        height={32}
        className="cursor-pointer"
      />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
          {count}
        </span>
      )}
    </Link>
  );
}
