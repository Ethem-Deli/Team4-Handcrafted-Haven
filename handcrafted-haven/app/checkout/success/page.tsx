import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order! 🎉</h1>
      <p className="text-gray-700 mb-6">
        Your order has been placed successfully. You will receive an email with
        the details soon.
      </p>

      <Link
        href="/shop"
        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Continue Shopping
      </Link>
    </main>
  );
}