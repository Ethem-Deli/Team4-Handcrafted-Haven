import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SellerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/auth/signin");
  }

  const sellerId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            userId: sellerId,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: true,
      items: { include: { product: true } },
    },
  });

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Orders Received</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order #{order.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm mb-2">
              Buyer: {order.buyer?.name ?? order.buyer?.email}
            </p>
            <ul className="text-sm space-y-1">
              {order.items.map((item: any) => (
                <li key={item.id}>
                  {item.quantity} × {item.product.title} — {item.price}
                </li>
              ))}
            </ul>
            <p className="text-sm mt-2">
              Status: <span className="font-semibold">{order.status}</span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}