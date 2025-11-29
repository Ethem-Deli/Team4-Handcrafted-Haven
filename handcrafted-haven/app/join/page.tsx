"use client";

import { useState } from "react";
import { registerUser } from "../actions/register";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "seller">("customer");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const formData = {
      role,
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      storeName: role === "seller" ? e.target.storeName.value : "",
      craftDescription: role === "seller" ? e.target.craftDescription.value : "",
    };

    const res = await registerUser(formData);

    if (!res.success) {
      alert(res.message);
      return;
    }

    alert("Account created!");
    router.push("/login");
  }

  return (
    <div className="px-6 py-12 max-w-xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Join Handcrafted Haven</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl space-y-5">

        {/* Role Selector */}
        <div>
          <label className="font-semibold">Register as:</label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === "customer"} onChange={() => setRole("customer")} />
              Customer
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" checked={role === "seller"} onChange={() => setRole("seller")} />
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
          <input name="email" type="email" required className="w-full border p-2 rounded-lg" />
        </div>

        {/* Password */}
        <div>
          <label className="font-semibold">Password</label>
          <input name="password" type="password" required className="w-full border p-2 rounded-lg" />
        </div>

        {/* Seller Fields */}
        {role === "seller" && (
          <>
            <div>
              <label className="font-semibold">Store Name</label>
              <input name="storeName" required className="w-full border p-2 rounded-lg" />
            </div>

            <div>
              <label className="font-semibold">About Your Craft</label>
              <textarea name="craftDescription" required className="w-full border p-2 rounded-lg h-24"></textarea>
            </div>
          </>
        )}

        <button className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-black">
          Join Now
        </button>

      </form>
    </div>
  );
}
