import { cookies } from "next/headers";

export default async function CustomerDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return <p className="p-10 text-center">You must be logged in.</p>;
  }

  const user = JSON.parse(session);

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <p className="text-gray-800">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-800 mt-2">
          <strong>Role:</strong> {user.role}
        </p>

        <h2 className="text-2xl font-semibold mt-6">Your Orders</h2>
        <p className="text-gray-600 mt-2">No orders yet.</p>
      </div>
    </div>
  );
}
