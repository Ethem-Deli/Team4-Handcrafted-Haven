"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      try {
        const res = await fetch("/api/seller");
        const data = await res.json();
        setSellers(data.sellers);
      } catch (err) {
        console.error("Failed to load sellers", err);
      } finally {
        setLoading(false);
      }
    }

    loadSellers();
  }, []);

  if (loading) {
    return <p className="p-10 text-center text-gray-600">Loading sellers...</p>;
  }

  return (
    <main className="p-10 bg-[#F1EDE3] min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Our Sellers
      </h1>

      {sellers.length === 0 ? (
        <p className="text-center text-gray-500">No sellers found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/seller/${seller.id}`}
              className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {seller.storeName || seller.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1">{seller.email}</p>

              <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                {seller.craftDescription || "Handcrafted artisan"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
