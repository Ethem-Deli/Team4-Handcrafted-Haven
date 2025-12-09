"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductModal({ product, onClose, onAdd }: any) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative animation-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-xl font-bold hover:text-black"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image
            src={product.image || "/images/placeholder.png"}
            alt={product.title}
            width={450}
            height={450}
            className="w-full h-80 object-cover rounded"
          />

          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-gray-600 mt-2 capitalize">
              {product.category?.name ?? product.category ?? "Uncategorized"}
            </p>

            <p className="text-xl font-semibold mt-4 text-green-700">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-700 mt-4 line-clamp-4">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onAdd(product)}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Add to Cart
              </button>

              <Link
                href={`/products/${product.id}`}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                View Details
              </Link>

              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation for modal */}
      <style jsx>{`
        .animation-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}