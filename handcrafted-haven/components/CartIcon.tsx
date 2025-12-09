"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  async function fetchCount() {
    try {
      const res = await fetch("/api/cart/count", { cache: "no-store" });
      const data = await res.json();
      setCount(data.count || 0);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    fetchCount();

    // Instant refresh when an item is added
    const update = () => fetchCount();
    window.addEventListener("cartUpdated", update);

    // Periodic fallback refresh every 10 seconds
    const interval = setInterval(fetchCount, 10000);

    return () => {
      window.removeEventListener("cartUpdated", update);
      clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/cart" className="relative inline-block">
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
