"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/seller-products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  async function handleDelete(id: number) {
    await deleteProduct(id);
    setProducts(products.filter((p: any) => p.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Products</h1>

        <Link href="/seller/products/new">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">
            + Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">Name</th>
              <th className="py-3">Price</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-center">${p.price}</td>
                <td className="py-3 text-center">
                  <Link
                    href={`/seller/products/edit/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>{" "}
                  |{" "}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
