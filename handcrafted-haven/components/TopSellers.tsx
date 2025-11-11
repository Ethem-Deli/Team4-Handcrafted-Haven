import SellerCard from "./SellerCard";

export default function TopSellers() {
  return (
    <section className="bg-[#EAE6DA] py-16 text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-10">Our Top Sellers</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
        <SellerCard name="Artisan Name" img="/images/artisan1.jpg" />
        <SellerCard name="Artisan Name" img="/images/artisan2.jpg" />
        <SellerCard name="Artisan Name" img="/images/artisan3.jpg" />
        <SellerCard name="Artisan Name" img="/images/artisan4.jpg" />
      </div>
    </section>
  );
}
