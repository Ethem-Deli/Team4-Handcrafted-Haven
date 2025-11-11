import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-beige text-charcoal shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-2xl font-heading text-sage">
          Handcrafted Haven
        </Link>
        <div className="space-x-6">
          <Link href="/products" className="hover:text-terracotta">Products</Link>
          <Link href="/sellers" className="hover:text-terracotta">Sellers</Link>
          <Link href="/about" className="hover:text-terracotta">About</Link>
        </div>
      </div>
    </nav>
  );
}
