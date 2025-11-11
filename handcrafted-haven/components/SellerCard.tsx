import Image from "next/image";

interface SellerCardProps {
  name: string;
  img: string;
}

export default function SellerCard({ name, img }: SellerCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
      <Image
        src={img}
        alt={name}
        width={250}
        height={250}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">Master artisan & creator</p>
      </div>
    </div>
  );
}
