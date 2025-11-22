"use client";

import Image from "next/image";
import React from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative w-full h-56">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-green-700">
            ${product.price.toFixed(2)}
          </span>
          <button className="bg-green-800 text-white text-sm px-4 py-1 rounded-xl hover:bg-green-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
