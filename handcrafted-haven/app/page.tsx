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
      <a
        href="/products"
        className="inline-block px-6 py-3 bg-terracotta text-white rounded-lg shadow hover:bg-sage transition"
      >
        Explore Products
      </a>
    </section>
  );
}
