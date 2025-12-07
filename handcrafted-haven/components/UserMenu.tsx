"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  const role = (session.user as any).role;

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-800 hover:text-black"
      >
        <User size={22} />
        <span>{session.user.name?.split(" ")[0] ?? "Account"}</span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {/* COMMON OPTIONS */}
          <Link href="/profile" className="dropdown-item">
            👤 Profile
          </Link>

          {role === "BUYER" && (
            <>
              <Link href="/orders" className="dropdown-item">
                📦 My Orders
              </Link>
              <Link href="/favorites" className="dropdown-item">
                ⭐ Favorites
              </Link>
            </>
          )}

          {role === "SELLER" && (
            <>
              <Link href="/seller" className="dropdown-item">
                🛍 Seller Dashboard
              </Link>
              <Link href="/products/upload" className="dropdown-item">
                ➕ Add Product
              </Link>
              <Link href="/seller/orders" className="dropdown-item">
                📦 Orders Received
              </Link>
            </>
          )}

          <button
            onClick={() => signOut()}
            className="dropdown-item text-red-600 hover:text-red-800"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
