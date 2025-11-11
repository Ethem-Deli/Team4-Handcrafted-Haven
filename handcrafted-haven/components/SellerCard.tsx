interface SellerCardProps {
  name: string;
  img: string;
}

export default function SellerCard({ name, img }: SellerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={img} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">Specializing in handmade crafts</p>
      </div>
    </div>
  );
}
