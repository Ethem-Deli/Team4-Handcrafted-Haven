"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, X } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "searchInput"
    ) as HTMLInputElement;
    const q = input.value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="bg-[#A6AE8C] text-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <span className="font-semibold text-xl">Handcrafted Haven</span>
        </Link>

        {/* HAMBURGER (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/*  DESKTOP MENU  */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/shop">Shop</Link>
            <Link className="nav-link" href="/about">About</Link>
            <Link className="nav-link" href="/search">Search</Link>

            {/* Seller Dashboard Link */}
            {session?.user && (session.user as any).role === "SELLER" && (
              <Link className="nav-link" href="/seller">
                Seller Dashboard
              </Link>
            )}
          </div>

          {/*  CART ICON */}
          <CartIcon />

          {/*  USER MENU / LOGIN */}
          {session?.user ? (
            <UserMenu />
          ) : (
            <div className="flex flex-col items-end">
              <Link href="/auth/signin">
                <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/*  MOBILE MENU  */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="nav-mobile">Home</Link>
            <Link href="/shop" className="nav-mobile">Shop</Link>
            <Link href="/about" className="nav-mobile">About</Link>
            <Link href="/search" className="nav-mobile">Search</Link>

            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center border rounded-lg overflow-hidden bg-white"
            >
              <input
                name="searchInput"
                placeholder="Search…"
                className="px-3 py-1 outline-none text-gray-800 w-full"
              />
              <button className="px-3 py-1 bg-gray-800 text-white hover:bg-black">
                🔍
              </button>
            </form>

            {/* Seller Dashboard (Mobile) */}
            {session?.user && (session.user as any).role === "SELLER" && (
              <Link href="/seller" className="nav-mobile font-semibold">
                Seller Dashboard
              </Link>
            )}

            {/* Auth (Mobile) */}
            {session?.user ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/auth/signin">
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Login
                  </button>
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-center underline font-medium text-green-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}