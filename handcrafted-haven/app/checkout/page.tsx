// app/checkout/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Redirect to login, then back to checkout (Option 1)
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p className="mb-4">
        You are logged in as <strong>{session.user.email}</strong>.
      </p>
      {/* You can add shipping/payment UI here later */}
      <p>Checkout flow coming soon…</p>
    </main>
  );
}
