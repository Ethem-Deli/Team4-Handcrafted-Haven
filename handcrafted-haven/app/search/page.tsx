"use client";

import { useState, use, useEffect } from "react";

// DB Product type
interface Product {
  id: number;
  title: string;
  price: number;
  image: string | null;
  description: string;
  category?: { name: string };
  user: { name: string | null; storeName: string | null };
}

// DB Seller type
interface Seller {
  id: number;
  name: string | null;
  storeName: string | null;
  craftDescription: string | null;
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

// Highlight matched substring
function highlight(text: string | null, query: string) {
  if (!text) return "";
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export default function SearchPage({ searchParams }: Props) {
  const params = use(searchParams);
  const initialQuery = (params?.q || "").trim();

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch DB categories only once
  useEffect(() => {
    async function loadCats() {
      const res = await fetch("/api/categories", { cache: "no-store" });
      const data = await res.json();
      setCategories(data.categories.map((c: any) => c.name.toLowerCase()));
    }
    loadCats();
  }, []);

  // Fetch DB results when query changes
  useEffect(() => {
    if (!query) return;

    async function fetchData() {
      const res = await fetch(`/api/search?q=${query}`, { cache: "no-store" });
      const data = await res.json();
      setProducts(data.products || []);
      setSellers(data.sellers || []);
    }

    fetchData();
  }, [query]);

  const filteredProducts = products.filter((p) => {
    const priceOK = p.price >= minPrice && p.price <= maxPrice;
    const categoryOK =
      selectedCategory === "all" ||
      p.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
    return priceOK && categoryOK;
  });

  const noResults = filteredProducts.length === 0 && sellers.length === 0;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      {/* Search Filters */}
      <div className="flex gap-4 mb-8 items-end">
        {/* Search */}
        <div className="flex flex-col w-1/3">
          <label className="font-medium mb-1">Search</label>
          <input
            className="border p-2 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by name or description..."
          />
        </div>

        {/* Category */}
        <div className="flex flex-col w-1/4">
          <label className="font-medium mb-1">Category</label>
          <select
            className="border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col w-1/6">
          <label className="font-medium mb-1">Min Price</label>
          <input
            className="border p-2 rounded"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            type="number"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col w-1/6">
          <label className="font-medium mb-1">Max Price</label>
          <input
            className="border p-2 rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            type="number"
          />
        </div>
      </div>

      {noResults && (
        <div className="text-gray-600 text-lg border p-6 rounded-lg bg-gray-50 max-w-lg">
          <strong>No results found.</strong>
          <br /> No matches for: <span className="font-medium">{query}</span>
        </div>
      )}

      {/* Products */}
      {filteredProducts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition"
              >
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3
                    className="text-xl font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: highlight(product.title, query),
                    }}
                  />
                  <p
                    className="text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{
                      __html: highlight(product.description, query),
                    }}
                  />
                  <p className="text-sm text-gray-500">
                    Sold by:{" "}
                    {product.user.storeName || product.user.name || "Seller"}
                  </p>
                  <p className="text-lg font-bold mt-3">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sellers */}
      {sellers.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-10">Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col items-center text-center"
              >
                <h3
                  className="text-xl font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: highlight(seller.storeName || seller.name || "", query),
                  }}
                />
                <p className="text-gray-600 mt-1">
                  {seller.craftDescription || "Amazing handmade crafts!"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
