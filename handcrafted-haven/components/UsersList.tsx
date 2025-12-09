import TopSellers from "@/components/TopSellers";

export default function UsersPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Our Sellers</h1>
      <TopSellers limit={0} /> {/* 0 = show all */}
    </main>
  );
}
