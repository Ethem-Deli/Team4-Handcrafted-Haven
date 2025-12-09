"use client";

import Image from "next/image";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string | null;
  _count?: { orderItems: number };
};

type Props = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  hideCart?: boolean;
};

export default function ProductCard({ product, onAddToCart, hideCart }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
      {/* PRODUCT IMAGE */}
      <div className="relative w-full h-56">
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* PRODUCT TEXT */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>

        {/* BOTTOM AREA */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>⭐ Popularity: {product._count?.orderItems ?? 0}</span>

          {/* ADD TO CART BUTTON only shown if not hidden and provided */}
          {!hideCart && onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevents opening modal when clicking add to cart
                onAddToCart(product);
              }}
              className="text-emerald-700 font-medium hover:underline"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}