"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ReviewModal from "@/components/ReviewModal";
import { useSession } from "next-auth/react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Load product and reviews 
  async function loadData() {
    const prodRes = await fetch(`/api/products?id=${id}`);
    const prodData = await prodRes.json();
    setProduct(prodData.products?.[0] || null);

    const revRes = await fetch(`/api/reviews/${id}`);
    const revData = await revRes.json();
    setReviews(revData.reviews || []);
  }

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // Calculate Average Rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* PRODUCT HEADER */}
      <div className="flex gap-6 flex-col md:flex-row">
        <Image
          src={product.image}
          alt={product.title}
          width={380}
          height={380}
          className="rounded-lg object-cover shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2 text-yellow-500">
            <span>{"★".repeat(Math.round(avgRating))}</span>
            <span className="text-gray-300">
              {"★".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-gray-700 ml-2">
              ({avgRating.toFixed(1)} / 5) – {reviews.length} reviews
            </span>
          </div>

          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-5 text-3xl font-bold text-green-700">
            ${product.price.toFixed(2)}
          </p>

          {/* WRITE REVIEW BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700"
          >
            Write a Review
          </button>
        </div>
      </div>

      <hr className="my-8" />

      {/* REVIEWS SECTION */}
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to rate it!</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b pb-3">
              <strong className="text-yellow-500 text-lg">
                {"★".repeat(r.rating)}
              </strong>
              <p className="text-gray-700 mt-1">{r.comment}</p>
              <small className="text-gray-500">
                — by {r.user?.name ?? r.user?.email}
              </small>
            </li>
          ))}
        </ul>
      )}

      {/* REVIEW MODAL */}
      {showModal && (
        <ReviewModal
          productId={Number(id)}
          onClose={() => setShowModal(false)}
          onSuccess={loadData}
        />
      )}
    </main>
  );
}