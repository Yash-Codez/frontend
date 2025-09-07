import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    username: localStorage.getItem("username") || "Admin",
    profilePhoto: "",
  });

  // Fetch latest admin profile from backend
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmin({
          username: res.data.username,
          profilePhoto: res.data.profilePhoto
            ? `https://backend-1-8lk6.onrender.com${res.data.profilePhoto}`
            : "",
        });

        // keep localStorage updated
        localStorage.setItem("username", res.data.username);
        if (res.data.profilePhoto) {
          localStorage.setItem("profilePhoto", `https://backend-1-8lk6.onrender.com${res.data.profilePhoto}`);
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-800">🌱 {admin.username}</h1>

        <button
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-3 text-green-800 hover:text-green-900 transition"
        >
          {admin.profilePhoto ? (
            <img
              src={admin.profilePhoto}
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
            />
          ) : (
            <img
              src="/images/profile-placeholder.png"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
            />
          )}
          <span className="hidden md:inline font-medium">{admin.username}</span>
        </button>
      </div>

      {/* Dashboard content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manage Products */}
          <div
            onClick={() => navigate("/admin/products")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-700">Manage Products</h3>
            <p className="text-gray-600 mt-2">Add, edit or delete plants & seeds.</p>
          </div>

          {/* Orders */}
          <div
            onClick={() => navigate("/admin/orders")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-700">Orders</h3>
            <p className="text-gray-600 mt-2">View and process customer orders.</p>
          </div>

          {/* Analytics */}
          <div
            onClick={() => navigate("/admin/analytics")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-700">Analytics</h3>
            <p className="text-gray-600 mt-2">Track sales and customer insights.</p>
          </div>

           <div
            onClick={() => navigate("/admin/delivery")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-green-700">Manage Delivery Boys</h3>
            <p className="text-gray-600 mt-2">Assign delivery agents to the orders</p>
          </div>
          {/* Plant Care */}
<div
  onClick={() => navigate("/admin/plant-care")}
  className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
>
  <h3 className="text-xl font-semibold text-green-700">Plant Care</h3>
  <p className="text-gray-600 mt-2">Add or manage plant care tips & guides.</p>
</div>

{/* Blog Management */}
<div
  onClick={() => navigate("/admin/blogs")}
  className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
>
  <h3 className="text-xl font-semibold text-green-700">Blog Management</h3>
  <p className="text-gray-600 mt-2">Create, edit or delete blog posts.</p>
</div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
