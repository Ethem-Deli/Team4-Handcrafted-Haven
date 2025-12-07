"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SkeletonProductCard from "@/components/SkeletonProductCard";

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string | null;
  category?: Category | null;
  _count?: { orderItems: number };
};
async function addToCart(productId: number) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId })
  });

  const data = await res.json();

  if (data.guest) {
    const cart = JSON.parse(localStorage.getItem("guest-cart") || "[]");
    const exists = cart.find((i: any) => i.productId === productId);
    if (exists) exists.quantity++;
    else cart.push({ productId, quantity: 1 });
    localStorage.setItem("guest-cart", JSON.stringify(cart));
    alert("Added (Guest)");
  } else {
    alert("Product added to cart");
  }
}


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<string>("popular");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search);

  /*  Load categories once */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || data || []))
      .catch(() => setCategories([]));
  }, []);

  /*  Load products when filters or search changes */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (categoryId !== "all") params.set("categoryId", categoryId);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId, minPrice, maxPrice, sort, debouncedSearch]);

  return (
    <main className="px-4 md:px-8 py-10 bg-[#F1EDE3] min-h-screen">
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6">
        Shop All Products
      </h1>

      {/* 🔎 FILTER BAR */}
      <section className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 md:items-end md:justify-between">

        {/* Category */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔍 Search */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-700 mb-1">Search Products</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Price Range */}
        <div className="flex gap-3 w-full md:w-1/3">
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min={0}
              className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="100"
              min={0}
              className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="popular">Popularity (Most Ordered)</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
          </select>
        </div>
      </section>

      {/* PRODUCT GRID */}
      {loading ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </section>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found for these filters.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="group bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out flex flex-col"
            >
              <div className="relative h-48">
                {product.image ? (
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h2>
                  <span className="text-emerald-700 font-bold">${product.price.toFixed(2)}</span>
                </div>

                {product.category && (
                  <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
                )}

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                  <span>⭐ Popularity: {product._count?.orderItems ?? 0}</span>
                  <button className="text-emerald-700 font-medium hover:underline">View details</button>
                  <button
                  onClick={() => addToCart(product.id)}
                  className="text-emerald-700 font-medium hover:underline">
                  + Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}