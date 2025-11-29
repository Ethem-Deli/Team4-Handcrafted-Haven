"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    const result = await loginUser(email, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    if (result.role === "seller") router.push("/seller");
    else router.push("/");
  }

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 shadow-lg rounded-xl space-y-5"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-black">
          Login
        </button>
      </form>
    </div>
  );
}
