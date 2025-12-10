import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { revalidatePath } from "next/cache";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
type OrderStatus = (typeof STATUSES)[number];

async function updateOrderStatus(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/auth/signin");
  }

  const sellerId = (session.user as any).id;
  const orderId = Number(formData.get("orderId"));
  const newStatus = formData.get("status") as OrderStatus;

  if (!STATUSES.includes(newStatus)) throw new Error("Invalid status");

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: { product: { userId: sellerId } },
      },
    },
  });

  if (!order) throw new Error("Unauthorized update");

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath(`/orders/${orderId}`);
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const sellerId = (session.user as any).id;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: {
        some: { product: { userId: sellerId } },
      },
    },
    include: {
      buyer: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
        <p className="text-gray-500">
          This order does not exist or you are not permitted to view it.
        </p>
      </main>
    );
  }

  const total = order.items.reduce(
    (
      sum: number,
      item: { quantity: number; price: number }
    ) => sum + item.quantity * item.price,
    0
  );

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-4">Order #{order.id}</h1>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600 text-sm">
            Date: {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-600 text-sm">
            Buyer: {order.buyer?.name ?? order.buyer?.email}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded text-sm font-semibold 
          ${
            order.status === "PENDING"
              ? "bg-yellow-200 text-yellow-800"
              : order.status === "PAID"
              ? "bg-blue-200 text-blue-800"
              : order.status === "SHIPPED"
              ? "bg-purple-200 text-purple-800"
              : order.status === "COMPLETED"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Items</h2>

        <ul className="space-y-4">
          {order.items.map(
            (
              item: {
                id: number;
                quantity: number;
                price: number;
                product: { title: string; image: string | null };
              }
            ) => (
              <li key={item.id} className="flex items-center gap-4">
                <Image
                  src={item.product.image || "/images/placeholder.png"}
                  alt={item.product.title}
                  width={70}
                  height={70}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-green-700">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </li>
            )
          )}
        </ul>
      </section>

      <div className="text-right font-bold text-xl mb-6">
        Total: ${total.toFixed(2)}
      </div>

      {(session.user as any).role === "SELLER" && (
        <form action={updateOrderStatus} className="flex items-center gap-3">
          <input type="hidden" name="orderId" value={order.id} />

          <select
            name="status"
            defaultValue={order.status}
            className="border rounded px-3 py-1"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 rounded text-white hover:bg-emerald-700"
          >
            Update Status
          </button>
        </form>
      )}
    </main>
  );
}
