"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    await addProduct(form);
    router.push("/seller/products");
  }

  async function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const upload = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await upload.json();
    setForm({ ...form, image: data.url });
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        {/* Name */}
        <input
          required
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Price */}
        <input
          required
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        {/* Category */}
        <input
          required
          placeholder="Category"
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        {/* IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Display uploaded image preview */}
        {form.image && (
          <img
            src={form.image}
            alt="Uploaded product"
            className="w-40 h-40 object-cover rounded border"
          />
        )}

        {/* Description */}
        <textarea
          required
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Submit */}
        <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-black">
          Add Product
        </button>
      </form>
    </div>
  );
}