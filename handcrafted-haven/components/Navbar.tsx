"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
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
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <span className="font-semibold text-xl">Handcrafted Haven</span>
        </div>

        {/* HAMBURGER BUTTON (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {/* NAV LINKS */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black"
            >
              Home
            </Link>

            <Link
              
              href="/shop"
              className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black">
              Shop
              
            </Link>

            <Link
              href="/about"
              className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black"
            >
              About
            </Link>
          </div>

          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border rounded-lg overflow-hidden bg-white"
          >
            <input
              name="searchInput"
              placeholder="Search…"
              className="px-3 py-1 outline-none text-gray-800"
            />
            <button className="px-3 py-1 bg-gray-800 text-white hover:bg-black">
              🔍
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <div className="flex flex-col gap-3">

            <Link href="/" className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black">Home</Link>
            <Link href="/shop" className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black">Shop</Link>
            <Link href="/about" className="relative inline-block text-lg text-gray-800 before:absolute before:bottom-0 before:left-0 before:block before:h-0.5 before:w-0 before:bg-black hover:before:w-full hover:before:transition-all hover:before:duration-300 hover:text-black">About</Link>

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

          </div>
        </div>
      )}
    </nav>
  );
}