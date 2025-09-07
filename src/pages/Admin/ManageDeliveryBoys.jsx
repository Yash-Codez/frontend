import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageDeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", contact: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDeliveryBoys = async () => {
    const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/delivery-boys", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeliveryBoys(res.data);
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("https://backend-1-8lk6.onrender.com/api/auth/delivery-boys", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ username: "", email: "", password: "", contact: "" });
    fetchDeliveryBoys();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://backend-1-8lk6.onrender.com/api/auth/delivery-boys/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDeliveryBoys();
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">🚚 Manage Delivery Boys</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="px-4 py-2 bg-green-700 text-white rounded-lg flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Add form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <button className="bg-green-700 text-white px-4 py-2 rounded">Add Delivery Boy</button>
      </form>

      {/* List */}
      <div className="grid md:grid-cols-2 gap-4 text-gray-800">
        {deliveryBoys.map((boy) => (
          <div key={boy._id} className="bg-white shadow p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{boy.username}</p>
              <p>{boy.email}</p>
              <p>{boy.contact}</p>
            </div>
            <button
              onClick={() => handleDelete(boy._id)}
              className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <FaTrash /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDeliveryBoys;
