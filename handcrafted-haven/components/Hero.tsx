"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-center text-white"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')", // place image in /public/images directory
      }}
    >
      <div className="bg-black bg-opacity-50 py-32 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to Handcrafted Haven
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          A community-driven marketplace connecting artisans and crafters with
          customers who appreciate the beauty of handmade goods.
        </p>

        <Link
          href="/shop"
          className="mt-8 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition inline-block"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
