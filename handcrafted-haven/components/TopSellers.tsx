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
      <div className="flex flex-wrap gap-y-11 justify-around items-center">
        {displayedSellers.map((seller) => (
          <SellerCard key={seller.id} name={seller.name} img={seller.img} />
        ))}
      </div>
    </section>
  );
}
