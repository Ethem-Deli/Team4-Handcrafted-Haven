"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  productId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReviewModal({ productId, onClose, onSuccess }: Props) {
  const { data: session } = useSession();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitReview() {
    if (!session?.user) {
      // Redirect to login then back to the product page
      window.location.href = `/auth/signin?callbackUrl=/products/${productId}`;
      return;
    }

    setLoading(true);

    // 🔥 Correct API endpoint
    const res = await fetch("/api/reviews/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Review posted!");
      onSuccess(); // Refresh page data
      onClose();   // Close the modal
    } else {
      alert("Failed to post review");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

        {/*Rating Selector */}
        <div className="flex gap-1 text-2xl mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setRating(i + 1)}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>

        {/* 💬 Comment Box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border rounded-lg p-2 h-24"
        />

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-1 rounded border">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={submitReview}
            className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            {loading ? "Posting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}