"use client";

import { useState } from "react";
import Image from "next/image";
import shopItems from "@/data/items.json";

const categories = [
  "Home & Living",
  "Jewelry",
  "Clothing",
  "Art & Collectibles",
  "Craft Supplies",
  "Weddings",
  "Toys",
  "Vintage",
  "Bags & Purses",
  "Woodwork",
];

// Flatten paginated items into one array
const allProducts = shopItems.pages.flatMap((page: any) =>
  page.items.map((item: any) => ({
    ...item,
    category: page.category, // attach category from page
  }))
);

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === null
      ? allProducts
      : allProducts.filter((p: any) => p.category === selectedCategory);

  return (
    <div className="px-6 py-10 flex gap-10">
      {/* ==================== SIDEBAR ==================== */}
      <aside className="w-64 bg-white shadow-md rounded-xl p-5 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Catalog</h2>

        <button
          onClick={() => setSelectedCategory(null)}
          className={`block w-full text-left py-2 px-3 rounded-lg mb-2 ${
            selectedCategory === null
              ? "bg-gray-800 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`block w-full text-left py-2 px-3 rounded-lg mb-2 ${
              selectedCategory === cat
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* ==================== PRODUCT GRID ==================== */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {selectedCategory || "All Products"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-60"
              />

              <h2 className="mt-3 text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{product.category}</p>
              <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>

              <p className="text-gray-700 text-sm mt-2">{product.description}</p>

              <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
