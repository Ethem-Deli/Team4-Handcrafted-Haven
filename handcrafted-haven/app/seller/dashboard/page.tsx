import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SELLER") {
    // Not logged in or not a seller → redirect to login
    redirect("/auth/signin?callbackUrl=/seller/dashboard");
  }

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <p className="text-gray-700">
        Welcome, {session.user.name || session.user.email}! Manage your products here.
      </p>
      {/* your product management UI here */}
    </div>
  );
}
