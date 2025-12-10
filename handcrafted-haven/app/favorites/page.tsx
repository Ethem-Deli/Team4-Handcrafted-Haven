import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "BUYER") redirect("/");

  return <main className="p-10">Favorites Page</main>;
}
