export default function SellerOrders() {
  const orders = [
    { id: 1, customer: "Aisha", total: 45.5, status: "Shipped" },
    { id: 2, customer: "Omar", total: 32.0, status: "Pending" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Total</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b text-center">
                <td className="py-3">{o.id}</td>
                <td className="py-3">{o.customer}</td>
                <td className="py-3">${o.total}</td>
                <td className="py-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
