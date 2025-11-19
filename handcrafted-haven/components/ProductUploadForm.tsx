"use client";

import { useState } from "react";

export default function UploadProductPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successful, setSuccessful] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;
  setImage(file);

  // Live preview
  if (file) {
    setPreview(URL.createObjectURL(file));
  } else {
    setPreview(null);
  }
};

  const validateForm = (formData: FormData) => {
    const newErrors: any = {};

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = formData.get("price")?.toString().trim();

    if (!title) newErrors.title = "Product title is required.";
    if (!description || description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (!price || isNaN(Number(price)))
      newErrors.price = "Price must be a valid number.";
    if (!imageFile) newErrors.image = "Image upload is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    // If no validation errors:
    setSuccessful(true);

    // Simulated delay
    setTimeout(() => {
      alert("Product uploaded successfully!");
    }, 800);
  };

  return (
    <section className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Upload a New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold">Product Title</label>
          <input
            type="text"
            name="title"
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Enter product name"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Write a product description..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold">Price ($)</label>
          <input
            type="number"
            name="price"
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-2"
          />
          {errors.image && (
            <p className="text-red-600 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Live Preview */}
        {preview && (
          <div className="mt-4 text-center">
            <p className="font-semibold mb-2">Image Preview:</p>
            <img
              src={preview}
              className="w-48 h-48 object-cover rounded-lg shadow"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-black font-semibold shadow-md transition-all duration-300 
            ${successful ? "bg-green-600" : "bg-terracotta hover:bg-green-600"}
          `}
        >
          {successful ? "Uploaded ✔" : "Submit Product"}
        </button>
      </form>
    </section>
  );
}
