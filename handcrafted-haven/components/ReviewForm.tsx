"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddReview({ productId }: any) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!session?.user)
    return (
      <p className="mt-6 text-gray-600">
        <em>You must be logged in to leave a review.</em>
      </p>
    );

  async function submitReview() {
    await fetch("/api/reviews/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    setComment("");
    window.location.reload();
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold">Add a Review</h3>

      {/* Rating Selector */}
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            className={`text-2xl ${
              rating >= i ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="w-full border rounded p-2 mt-3"
        rows={3}
        placeholder="Write a review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submitReview}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Review
      </button>
    </div>
  );
}
