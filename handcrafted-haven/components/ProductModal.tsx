"use client";

import React from "react";

export default function ProductModal({ product, onClose, onAdd }: any) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">✕</button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded" />

          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.category}</p>
            <p className="text-xl font-semibold mt-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mt-4">{product.description}</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onAdd(product)}
                className="bg-gray-800 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
              <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}