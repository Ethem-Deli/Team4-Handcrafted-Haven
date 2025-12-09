"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/auth/redirect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Login to Your Account
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-700">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-green-700 font-medium hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
}
