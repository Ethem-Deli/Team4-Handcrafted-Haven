import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sellerId = Number(id);

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { name: true, storeName: true, craftDescription: true },
  });

  const products = await prisma.product.findMany({
    where: { userId: sellerId },
  });

  return (
    <main className="p-10 bg-[#F1EDE3] min-h-screen">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {seller?.storeName || seller?.name || "Unknown Seller"}
        </h1>
        <p className="text-gray-600 mt-3">
          {seller?.craftDescription || "Handcrafted artisan."}
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map(
            (
              product: {
                id: number;
                title: string;
                price: number;
                image: string | null;
                description: string;
              }
            ) => (
              <ProductCard key={product.id} product={product} hideCart />
            )
          )}
        </div>
      )}
    </main>
  );
}
