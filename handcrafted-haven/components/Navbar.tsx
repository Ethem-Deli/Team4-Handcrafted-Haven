import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#A6AE8C] text-gray-900 flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.jpg" alt="Logo" width={80} height={80} />
        <span className="font-semibold text-xl">Handcrafted Haven</span>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/shop" className="hover:underline">Shop</Link>
        <Link href="/about" className="hover:underline">About</Link>
      </div>
    </nav>
  );
}
