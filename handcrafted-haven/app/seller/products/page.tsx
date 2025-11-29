"use client";

import Link from "next/link";

export default function SellerProducts() {
  // Replcae with json shop data later just uncomment below line 
  /*
  import shopItems from "@/data/items.json";

  const products = shopItems.pages.flatMap((page) =>
    page.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: page.category,
      image: item.image,
      description: item.description,
    }))
  );
  */
  // Temporary sample products -- after uncommnenting above code remove below block or comment it out
  const products = [
    { id: 1, name: "Handwoven Basket", price: 25.0 },
    { id: 2, name: "Clay Pot", price: 30.0 },
  ];

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
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-center">${p.price}</td>
                <td className="py-3 text-center">
                  <button className="text-blue-600 hover:underline">Edit</button>{" "}
                  |{" "}
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
