"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;

    const formData = {
      role,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      storeName:
        role === "seller"
          ? (form.elements.namedItem("storeName") as HTMLInputElement).value
          : "",
      craftDescription:
        role === "seller"
          ? (form.elements.namedItem(
              "craftDescription"
            ) as HTMLTextAreaElement).value
          : "",
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Account created! Please sign in.");
      router.push("/auth/signin?registered=true");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-6 py-12 max-w-xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Join Handcrafted Haven
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-xl space-y-5"
      >
        {/* Role Selector */}
        <div>
          <label className="font-semibold">Register as:</label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
              />
              Customer
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Seller
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="font-semibold">Full Name</label>
          <input name="name" required className="w-full border p-2 rounded-lg" />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Password */}
        <div>
          <label className="font-semibold">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Seller Fields */}
        {role === "seller" && (
          <>
            <div>
              <label className="font-semibold">Store Name</label>
              <input
                name="storeName"
                required
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold">About Your Craft</label>
              <textarea
                name="craftDescription"
                required
                className="w-full border p-2 rounded-lg h-24"
              ></textarea>
            </div>
          </>
        )}

        <button
          disabled={loading}
          className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-black disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Join Now"}
        </button>
      </form>
    </div>
  );
}
