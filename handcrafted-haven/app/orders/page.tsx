import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);

  // Must be logged in and must be a Buyer
  const role = (session?.user as any)?.role;
  const idFromSession = (session?.user as any)?.id;

  // if no login or no buyer, redirect
  if (!session?.user || role !== "BUYER") {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  // validate ID
  const userId = Number(idFromSession);
  if (!userId) {
    console.error("⚠ session.user.id missing!", session?.user);
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="text-sm mb-2">
                Status: <span className="font-semibold">{order.status}</span>
              </p>

              <ul className="text-sm space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product.title} — $
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}