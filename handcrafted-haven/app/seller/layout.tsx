"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-lg ${
      pathname === path ? "bg-gray-800 text-white" : "hover:bg-gray-200"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>

        <nav className="space-y-3">
          <Link href="/seller" className={linkClass("/seller")}>
            Overview
          </Link>
          <Link href="/seller/products" className={linkClass("/seller/products")}>
            Products
          </Link>
          <Link href="/seller/products/new" className={linkClass("/seller/products/new")}>
            Add Product
          </Link>
          <Link href="/seller/orders" className={linkClass("/seller/orders")}>
            Orders
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
