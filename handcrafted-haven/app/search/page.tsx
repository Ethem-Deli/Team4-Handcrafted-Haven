import { products } from "@/data/products";
import { sellers, Seller } from "@/data/sellers";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface SearchParams {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchParams) {
  const query = (searchParams.q || "").trim().toLowerCase();

  // Filter products by name or description
  const filteredProducts = products.filter((product: Product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  // Filter sellers by name
  const filteredSellers = sellers.filter((seller: Seller) =>
    seller.name.toLowerCase().includes(query)
  );

  // Determine if there are no results at all
  const noResults = filteredProducts.length === 0 && filteredSellers.length === 0;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for: <span className="text-terracotta">{query}</span>
      </h1>

      {/* No results */}
      {noResults && (
        <div className="text-gray-600 text-lg border p-6 rounded-lg bg-gray-50 max-w-lg">
          <strong>No results found.</strong>
          <br />
          No products or sellers match: <span className="font-medium">{query}</span>
        </div>
      )}

      {/* Products grid - only if products found */}
      {filteredProducts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                  <p className="text-lg font-bold mt-3">${product.price}</p>
                  <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-black">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sellers grid - only if sellers found */}
      {filteredSellers.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 mt-10">Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col items-center"
              >
                <img
                  src={seller.img}
                  alt={seller.name}
                  className="w-32 h-32 object-cover rounded-full mb-3"
                />
                <h3 className="text-xl font-semibold text-center">{seller.name}</h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
