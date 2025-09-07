import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // ✅ ensure _id + name stored at login

  const renderStars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

  // Fetch product + reviews
  const fetchData = async () => {
    try {
      const res = await axios.get(`https://backend-1-8lk6.onrender.com/api/products/${id}`);
      setProduct(res.data.product);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Submit new review
  const handleSubmitReview = async () => {
    if (!rating || !comment) return alert("Please add rating & comment");
    try {
      await axios.post(
        `https://backend-1-8lk6.onrender.com/api/reviews`,
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(0);
      fetchData();
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  // Update review
  const handleUpdateReview = async (reviewId) => {
    if (!rating || !comment) return alert("Please add rating & comment");
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/reviews/${reviewId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReview(null);
      setComment("");
      setRating(0);
      fetchData();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
        <img
          src={
            product.image
              ? `https://backend-1-8lk6.onrender.com${product.image}`
              : "/images/plant-placeholder.png"
          }
          alt={product.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold text-green-900">{product.name}</h1>
        <p className="text-gray-800">{product.description}</p>
        <p className="font-bold text-lg mt-2">₹{product.price}</p>

        {/* ⭐ Reviews */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-700">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div
                key={r._id}
                className="border-b border-gray-200 py-2 text-gray-900"
              >
                {editingReview === r._id ? (
                  <div>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border rounded p-2 mr-2"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Star{n > 1 && "s"}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border rounded p-2 mt-2"
                    />
                    <button
                      onClick={() => handleUpdateReview(r._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-yellow-500">{renderStars(r.rating)}</p>
                    <p>{r.comment}</p>
                    <small className="text-gray-600">
                      <small className="text-gray-600">
                        By {r.user?.username || "Anonymous"}
                      </small>

                    </small>

                    {/* Only allow update/delete for own review */}
                    {user && (r.user?._id === user.id || r.user?._id === user._id) && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingReview(r._id);
                            setRating(r.rating);
                            setComment(r.comment);
                          }}
                          className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}


                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* ⭐ Add Review */}
        {token && !editingReview && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800">Add Your Review</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded p-2 mr-2"
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 && "s"}
                </option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded p-2 mt-2"
            />
            <button
              onClick={handleSubmitReview}
              className="mt-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
