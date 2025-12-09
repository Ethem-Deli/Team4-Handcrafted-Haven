"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TopSellers from "@/components/TopSellers";
import Hero from "@/components/Hero";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  async function loadTopProducts() {
    try {
      const res = await fetch("/api/products/top", { cache: "no-store" });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load top products:", err);
    }
  }

  // Load initially + refresh every 30 seconds
  useEffect(() => {
    loadTopProducts();
    const timer = setInterval(loadTopProducts, 30000);
    return () => clearInterval(timer);
  }, []);
  
  async function handleAddToCart(product: any) {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Please sign in to add items to your cart.");
          return;
        }
        alert("Could not add to cart. Please try again.");
        return;
      }

      alert("Item added to cart ✅");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="text-center space-y-6">
      <Hero />

      {/* Top Sellers Section */}
      <div className="py-12">
        <TopSellers limit={3} />
        <Link
          href="/sellers"
          className="mt-8 inline-block px-12 py-3 bg-terracotta text-black rounded-lg shadow hover:bg-slate-900 hover:text-white transition-colors duration-300"
        >
          Explore More Sellers
        </Link>
      </div>

      {/* Our Top Products From DB */}
      <main className="px-8 py-12 bg-[#F1EDE3] min-h-screen">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Our Top Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </main>

      <Link
        href="/shop"
        className="inline-block px-12 py-3 bg-terracotta text-black rounded-lg shadow hover:bg-slate-900 hover:text-white transition-colors duration-300"
      >
        Explore More Products
      </Link>

      <div>
        <Link
          href="/products/upload"
          className="inline-block bg-terracotta text-black px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 transition-all duration-300"
        >
          Upload a Product
        </Link>
      </div>
    </section>
  );
}
