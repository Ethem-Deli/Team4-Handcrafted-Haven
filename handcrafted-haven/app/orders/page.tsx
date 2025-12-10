import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
type OrderStatus = (typeof STATUSES)[number];

// SERVER ACTION to update order status
async function updateOrderStatus(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/auth/signin");
  }

  const sellerId = (session.user as any).id;
  const orderId = Number(formData.get("orderId"));
  const newStatus = formData.get("status") as OrderStatus;

  if (!STATUSES.includes(newStatus)) {
    throw new Error("Invalid status");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: { product: { userId: sellerId } },
      },
    },
  });

  if (!order) throw new Error("Order not found or not authorized");

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath("/orders");
}

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
          product: { userId: sellerId },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      buyer: true,
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Orders Received</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map(
        (
          order: {
            id: number;
            status: OrderStatus;
            createdAt: Date;
            buyer: { name: string | null; email: string } | null;
            items: {
              id: number;
              quantity: number;
              price: number;
              product: { title: string };
            }[];
          }
        ) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Order #{order.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm mb-1">
              Buyer: {order.buyer?.name ?? order.buyer?.email}
            </p>

            <p className="text-sm mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100">
                {order.status}
              </span>
            </p>

            <ul className="text-sm space-y-1 mb-3">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity} × {item.product.title} — $
                  {item.price.toFixed(2)}
                </li>
              ))}
            </ul>

            <form action={updateOrderStatus} className="flex items-center gap-2 mt-2">
              <input type="hidden" name="orderId" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                className="border rounded px-2 py-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Update Status
              </button>
            </form>
          </div>
        )
      )}
    </main>
  );
}