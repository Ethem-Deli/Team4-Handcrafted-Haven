export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-center text-white"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')", // place your image in /public/images directory 
      }}
    >
      <div className="bg-black bg-opacity-50 py-32">
        <h1 className="text-4xl font-bold mb-6">Welcome to Handcrafted Haven</h1>
        <p className="max-w-2xl mx-auto text-lg text-softgray">
        A community-driven marketplace connecting artisans and crafters
        with customers who appreciate the beauty of handmade goods.
      </p>
        <button className="mt-8 bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
          Shop now
        </button>
      </div>
    </section>
  );
}
