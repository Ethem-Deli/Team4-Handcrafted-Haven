import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SellerDashboard from "@/components/seller/Dashboard";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is a seller
  if (session.user.role !== "SELLER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SellerDashboard user={session.user} />
    </div>
  );
}