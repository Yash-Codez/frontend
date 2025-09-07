import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

const PlantCareAdmin = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTips = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/plant-care");
      setTips(res.data);
    } catch (err) {
      console.error("Error fetching tips:", err);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ title: "", description: "", image: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `https://backend-1-8lk6.onrender.com/api/plant-care/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Tip updated successfully");
      } else {
        await axios.post("https://backend-1-8lk6.onrender.com/api/plant-care", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Tip added successfully");
      }
      resetForm();
      fetchTips();
    } catch (err) {
      console.error("Error saving tip:", err);
    }
  };

  const handleEdit = (tip) => {
    setForm({
      title: tip.title,
      description: tip.description,
      image: tip.image,
    });
    setEditingId(tip._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tip?")) return;
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/plant-care/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTips();
    } catch (err) {
      console.error("Error deleting tip:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          🌿 Manage Plant Care Tips
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Add / Edit Tip Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          {editingId ? <FaSyncAlt /> : <FaPlus />}
          {editingId ? "Edit Tip" : "Add New Tip"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Tip Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        ></textarea>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            {editingId ? <FaSyncAlt /> : <FaPlus />}
            {editingId ? "Update Tip" : "Add Tip"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>

      {/* Tips List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <div key={tip._id} className="bg-white shadow-md rounded-xl p-4">
            {tip.image && (
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-bold text-green-700">{tip.title}</h3>
            <p className="text-gray-600">{tip.description}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(tip)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(tip._id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantCareAdmin;
