"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ShopPage() {
  // Filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [page, setPage] = useState(1);

  // Data
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories
  useEffect(() => {
    async function loadCats() {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      setCategories(data.categories.map((c: any) => c.name.toLowerCase()));
    }
    loadCats();
  }, []);

  // Fetch Products when filters change
  useEffect(() => {
    async function loadProducts() {
      const params = new URLSearchParams({
        q,
        category,
        sort,
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        page: page.toString(),
      });

      const res = await fetch(`/api/shop?${params}`, { cache: "no-store" });
      const data = await res.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
    }
    loadProducts();
  }, [q, category, sort, minPrice, maxPrice, page]);

  return (
    <main className="p-10 bg-[#F1EDE3] min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Shop Products
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">

        <input
          type="text"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="p-2 border rounded-lg"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        <input
          type="number"
          placeholder="Min price"
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="p-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Max price"
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={() => null} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          No products found.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>

        <span className="font-semibold">{page} / {totalPages}</span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </main>
  );
}
