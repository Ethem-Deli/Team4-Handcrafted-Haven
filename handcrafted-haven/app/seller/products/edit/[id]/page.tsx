"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { editProduct } from "@/app/actions/products";

export default function EditProductPage({ params }: any) {
  const router = useRouter();
  const productId = parseInt(params.id);

  const [product, setProduct] = useState<any>(null);

  // Fetch the product by ID
  useEffect(() => {
    fetch("/api/seller-products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.products.find((p: any) => p.id === productId);
        setProduct(found);
      });
  }, [productId]);

  if (!product) {
    return <p className="text-gray-600">Loading product…</p>;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    await editProduct(product);
    router.push("/seller/products");
  }

  function updateField(field: string, value: string) {
    setProduct({ ...product, [field]: value });
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Name Section */}
        <div>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Price Section */}
        <div>
          <label className="font-semibold">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => updateField("price", e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Category Section */}
        <div>
          <label className="font-semibold">Category</label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="font-semibold">Image URL</label>
          <input
            type="text"
            value={product.image}
            onChange={(e) => updateField("image", e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description Section */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Submit button section */}
        <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-black">
          Save Changes
        </button>
      </form>
    </div>
  );
}