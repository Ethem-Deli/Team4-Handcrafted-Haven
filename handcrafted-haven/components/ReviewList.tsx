export default function ReviewList({ reviews }: any) {
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-600">No reviews yet.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

      {reviews.map((r: any) => (
        <div key={r.id} className="border-b pb-3 mb-3">
          <p className="font-semibold">{r.user?.name || "Anonymous"}</p>

          <p className="text-yellow-500">
            {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
          </p>

          {r.comment && <p className="mt-1">{r.comment}</p>}

          <p className="text-sm text-gray-500 mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
