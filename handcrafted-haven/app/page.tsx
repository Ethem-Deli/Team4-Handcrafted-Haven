import Hero from "@/components/Hero";
import TopSellers from "@/components/TopSellers";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <section className="text-center space-y-6">
      <h1 className="text-4xl font-heading text-sage">
        Welcome to Handcrafted Haven
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-softgray">
        A community-driven marketplace connecting artisans and crafters
        with customers who appreciate the beauty of handmade goods.
      </p>
      <main className="px-8 py-12 bg-[#F1EDE3] min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Our Top Sellers
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
      <a
  href="/products"
  className="inline-block px-6 py-3 bg-terracotta text-black rounded-lg shadow hover:bg-slate-900 hover:text-white transition-colors duration-300"
>
  Explore Products
</a>
    </section>
  );
}
