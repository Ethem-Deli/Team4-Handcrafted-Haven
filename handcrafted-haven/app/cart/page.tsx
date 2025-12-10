import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";;
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// SERVER ACTIONS

async function increaseAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("itemId"));
  await prisma.cartItem.update({
    where: { id },
    data: { quantity: { increment: 1 } },
  });
  revalidatePath("/cart");
}

async function decreaseAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("itemId"));
  const item = await prisma.cartItem.findUnique({ where: { id } });

  if (item && item.quantity > 1) {
    await prisma.cartItem.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });
  } else {
    await prisma.cartItem.delete({ where: { id } });
  }
  revalidatePath("/cart");
}

async function removeAction(formData: FormData) {
  "use server";
  const id = Number(formData.get("itemId"));
  await prisma.cartItem.delete({ where: { id } });
  revalidatePath("/cart");
}

// PAGE

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="p-10 text-center">
        <p className="text-lg">You must be logged in to view your cart.</p>
        <Link
          href="/auth/signin"
          className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md"
        >
          Login
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: user!.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Go Shopping 🛍️
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
  (sum: number, item: { quantity: number; product: { price: number } }) =>
    sum + item.quantity * item.product.price,
  0
);

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.product.image || "/images/placeholder.png"}
                alt={item.product.title}
                width={90}
                height={90}
                className="rounded-md object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.title}</h2>
                <p className="text-gray-600">
                  ${item.product.price.toFixed(2)} × {item.quantity}
                </p>
                <p className="font-bold text-green-700">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* DECREASE */}
              <form action={decreaseAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button className="px-3 py-1 bg-gray-200 rounded">-</button>
              </form>

              {/* INCREASE */}
              <form action={increaseAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button className="px-3 py-1 bg-gray-200 rounded">+</button>
              </form>

              {/* REMOVE */}
              <form action={removeAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button className="px-3 py-1 bg-red-600 text-white rounded">
                  Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-right">
        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>

        {/* Go to Checkout page */}
        <Link
          href="/checkout"
          className="mt-4 inline-block bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}