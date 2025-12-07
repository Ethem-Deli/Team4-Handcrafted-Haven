"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState<"SELLER" | "BUYER">("SELLER");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    const storeName = formData.get("storeName") as string;
    const craftDescription = formData.get("craftDescription") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          storeName,
          craftDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to register.");
        setLoading(false);
        return;
      }

      // Go to login page
      router.push("/auth/signin");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create an account
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            className="w-full border rounded-lg px-3 py-2 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded-lg px-3 py-2 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border rounded-lg px-3 py-2 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm"
            className="w-full border rounded-lg px-3 py-2 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Account Type</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "SELLER" | "BUYER")
            }
            className="w-full border rounded-lg px-3 py-2 outline-none"
            name="role"
          >
            <option value="SELLER">Seller</option>
            <option value="BUYER">Buyer</option>
          </select>
        </div>

        {role === "SELLER" && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Store Name
              </label>
              <input
                name="storeName"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Craft Description
              </label>
              <textarea
                name="craftDescription"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                rows={3}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}