import SellerCard from "./SellerCard";
import { sellers } from "@/data/sellers";

interface TopSellersProps {
  limit?: number; // Optional limit for homepage
}

export default function TopSellers({ limit }: TopSellersProps) {
  const displayedSellers = limit ? sellers.slice(0, limit) : sellers;

  return (
    <section className="bg-[#EAE6DA] py-16 text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-10">Our Top Sellers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
        {displayedSellers.map((seller) => (
          <SellerCard key={seller.id} name={seller.name} img={seller.img} />
        ))}
      </div>
    </section>
  );
}
