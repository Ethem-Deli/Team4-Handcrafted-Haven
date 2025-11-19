import { Suspense } from "react";

export default function SearchPage({ searchParams }: any) {
  const q = searchParams.q || "";

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Search Results for: <span className="text-terracotta">{q}</span>
      </h1>

      <p className="text-gray-700">
        TODO: Implement product filtering and display here…
      </p>
    </div>
  );
}
