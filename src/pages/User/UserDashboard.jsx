import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "User",
    profilePhoto: "",
  });
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          username: res.data.username,
          profilePhoto: res.data.profilePhoto
            ? `https://backend-1-8lk6.onrender.com${res.data.profilePhoto}`
            : "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const fetchCounts = async () => {
      try {
        const [cartRes, wishlistRes, ordersRes] = await Promise.all([
          axios.get("https://backend-1-8lk6.onrender.com/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://backend-1-8lk6.onrender.com/api/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://backend-1-8lk6.onrender.com/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCartCount(cartRes.data.length);
        setWishlistCount(wishlistRes.data.length);
        setOrderCount(ordersRes.data.length);
      } catch (err) {
        console.error("Error fetching cart/wishlist/order counts:", err);
      }
    };

    fetchUser();
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          🌱 Welcome, {user.username}
        </h1>
        <button
          onClick={() => navigate("/user/profile")}
          className="flex items-center gap-3 text-green-800 hover:text-green-900 transition"
        >
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
            />
          ) : (
            <img
              src="/images/profile-placeholder.png"
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
            />
          )}
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div
          onClick={() => navigate("/user/orders")}
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-green-700">
            My Orders ({orderCount})
          </h2>
          <p className="text-gray-600 mt-2">Check status of your plant orders.</p>
        </div>

        {/* Wishlist */}
        <div
          onClick={() => navigate("/user/wishlist")}
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-green-700">
            Wishlist ({wishlistCount})
          </h2>
          <p className="text-gray-600 mt-2">See your saved plants & accessories.</p>
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/user/cart")}
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-green-700">
            Cart ({cartCount})
          </h2>
          <p className="text-gray-600 mt-2">View and checkout your cart items.</p>
        </div>

        {/* Browse Products */}
        <div
          onClick={() => navigate("/user/products")}
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-green-700">Browse Products</h2>
          <p className="text-gray-600 mt-2">See indoor, outdoor, seeds, and more.</p>
        </div>

        {/* Addresses */}

      </div>
    </div>
  );
};

export default UserDashboard;
