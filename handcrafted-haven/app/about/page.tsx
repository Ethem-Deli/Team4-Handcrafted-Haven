export default function AboutPage() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">About Handcrafted Haven</h1>

      <p className="text-lg leading-relaxed mb-6">
        Welcome to <span className="font-semibold">Handcrafted Haven</span> a warm,
        creative space where artistry, dedication, and human craftsmanship come together.
        We celebrate the uniqueness of handmade goods by bringing together talented artisans
        and people who appreciate meaningful, personally crafted items.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Our Mission</h2>
      <p className="leading-relaxed mb-6">
        In a world full of mass produced products, our mission is simple:
        <span className="font-semibold"> give handmade creators a home</span>.
        Every item you see in our store tells a story  of patience, passion, and the
        skill of the hands that made it. We aim to support small crafters while offering
        customers something truly special and one of a kind.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">What We Offer</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Unique handmade goods crafted with care</li>
        <li>Support for local and independent artisans</li>
        <li>Products created from quality, sustainable materials</li>
        <li>A curated marketplace focused on creativity and authenticity</li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">Why Handmade?</h2>
      <p className="leading-relaxed mb-6">
        Handmade items carry a charm that no factory machine can recreate. They hold
        personality, intention, and heart. At Handcrafted Haven, we believe these creations
        deserve a spotlight and customers deserve the joy of owning something unlike
        anything else.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-4">Our Vision</h2>
      <p className="leading-relaxed mb-6">
        We are building a community   a place where creativity thrives, artisans can
        showcase their best work, and customers can discover items that inspire, uplift,
        and bring beauty into everyday life. Handcrafted Haven is more than a store; it's
        a celebration of craft, culture, and human connection.
      </p>

      <div className="mt-12 p-6 border rounded-xl bg-gray-50 shadow-sm">
        <p className="text-lg font-semibold mb-2">Thank you for supporting handmade.</p>
        <p className="leading-relaxed">
          Every purchase makes a difference in the lives of artists and craftspeople
          around the world. Together, we help keep traditional skills alive, encourage
          creativity, and make the world a little more beautiful   one item at a time.
        </p>
          </div>
          <div className="mt-12 p-6 border rounded-xl bg-blue-50 shadow-sm hover:bg-green-100 transition-colors duration-300">
        <p className="text-lg font-semibold mb-2"><span className="font-bold">Made by Ethem & Faharetana</span></p>
        <p className="leading-relaxed">
          As students of <strong>WDD 430 Term 5 2025</strong>, we are thrilled to present Handcrafted Haven as our
          final project. This platform is a testament to our dedication to learning and
          our passion for craftsmanship. We hope you enjoy exploring the unique handmade
          creations featured here as much as we enjoyed building this site.
        </p>
      </div>
    </div>
  );
}