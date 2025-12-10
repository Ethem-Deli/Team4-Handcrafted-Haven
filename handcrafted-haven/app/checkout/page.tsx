import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import Link from "next/link";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// SERVER ACTION — Handle checkout submission
async function handleCheckout(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const paymentMethod = formData.get("paymentMethod") as string;
  const fullName = formData.get("fullName") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const phone = formData.get("phone") as string;

  // Find user & cart
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // COD PAYMENT
  if (paymentMethod === "cod") {
    const order = await prisma.order.create({
      data: {
        status: "PENDING", // enum from DB
        buyer: { connect: { id: user.id } },

        // CREATE ORDER ITEMS
        items: {
          create: cart.items.map(
            (
              item: {
                productId: number;
                quantity: number;
                product: { price: number; title: string };
              }
            ) => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              price: item.product.price,
            })
          ),
        },

        // SAVE SHIPPING DETAILS
        fullName,
        address,
        city,
        country,
        phone,
      },
    });

    // CLEAR CART
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    revalidatePath("/cart");

    redirect(`/checkout/success?orderId=${order.id}`);
  }

  // CARD (STRIPE) PAYMENT
  if (paymentMethod === "card") {
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20" as any,
    });

    const lineItems = cart.items.map(
      (
        item: { quantity: number; product: { price: number; title: string } }
      ) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.product.title },
          unit_amount: Math.round(item.product.price * 100), // cents
        },
        quantity: item.quantity,
      })
    );

    // Stripe Session
    const sessionStripe = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
    });

    redirect(sessionStripe.url!);
  }

  throw new Error("Invalid payment method");
}

// MAIN CHECKOUT PAGE
export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: user!.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const total = cart.items.reduce(
    (sum: number, item: { quantity: number; product: { price: number } }) =>
      sum + item.quantity * item.product.price,
    0
  );

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* ORDER SUMMARY */}
      <section className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
        <ul className="space-y-2">
          {cart.items.map(
            (
              item: {
                id: number;
                quantity: number;
                product: { price: number; title: string };
              }
            ) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.title} × {item.quantity}
                </span>
                <span>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </li>
            )
          )}
        </ul>
        <p className="mt-4 text-right text-lg font-bold">
          Total: ${total.toFixed(2)}
        </p>
      </section>

      {/* CHECKOUT FORM */}
      <form
        action={handleCheckout}
        className="bg-white p-4 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">Shipping Details</h2>

        <input
          name="fullName"
          required
          placeholder="Full name"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="address"
          required
          placeholder="Address"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-3">
          <input
            name="city"
            required
            placeholder="City"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            name="country"
            required
            placeholder="Country"
            className="w-1/2 border rounded px-3 py-2"
          />
        </div>
        <input
          name="phone"
          required
          placeholder="Phone number"
          className="w-full border rounded px-3 py-2"
        />

        <h2 className="text-xl font-semibold mt-4">Payment Method</h2>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="cod" defaultChecked />
            <span>Cash on Delivery (COD)</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="paymentMethod" value="card" />
            <span>Credit/Debit Card (Stripe)</span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Place Order
        </button>

        <p className="text-xs text-gray-500 mt-2">
          * For Stripe payments, you will be redirected to a secure payment page.
        </p>
      </form>

      <div className="mt-4">
        <Link href="/cart" className="text-blue-600 underline">
          ← Back to Cart
        </Link>
      </div>
    </main>
  );
}
