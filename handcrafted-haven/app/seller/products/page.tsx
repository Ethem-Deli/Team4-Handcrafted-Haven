import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";;

export default async function SellerProducts() {
  const session = await getServerSession(authOptions);
  const sellerId = (session?.user as any)?.id;

  const products = await prisma.product.findMany({
    where: { userId: sellerId },
    include: { reviews: true },
  });

  const sellerRating =
    products.flatMap(p => p.reviews).reduce((a, r) => a + r.rating, 0) /
    products.flatMap(p => p.reviews).length || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Products</h1>
          <p className="text-yellow-500 mt-1">
            ⭐ Seller Rating: {sellerRating.toFixed(1)} / 5
          </p>
        </div>

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
              <th className="py-3">Rating</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="py-3">{p.title}</td>
                <td className="py-3 text-center">${p.price}</td>
                <td className="py-3 text-center">
                  ⭐{" "}
                  {p.reviews.length
                    ? (
                        p.reviews.reduce((a, r) => a + r.rating, 0) /
                        p.reviews.length
                      ).toFixed(1)
                    : "0"}
                </td>
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