import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#A6AE8C] text-gray-900 flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.jpg" alt="Logo" width={80} height={80} className="rounded-full"/>
        <span className="font-semibold text-xl">Handcrafted Haven</span>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="relative inline-block text-lg text-gray-800  
  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-black
  hover:before:w-full hover:before:transition-all hover:before:duration-300
  hover:text-black">Home</Link>
        <Link href="/shop" className="relative inline-block text-lg text-gray-800  
  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-black
  hover:before:w-full hover:before:transition-all hover:before:duration-300
  hover:text-black">Shop</Link>
        <Link href="/about" className="relative inline-block text-lg text-gray-800  
  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-black
  hover:before:w-full hover:before:transition-all hover:before:duration-300
  hover:text-black">About</Link>
      </div>
    </nav>
  );
}
