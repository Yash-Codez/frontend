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

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "indoor",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      discount: "",
      stock: "",
      category: "indoor",
      image: null,
    });
    setEditingId(null);
  };

  // Add / Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        fd.append(key, form[key]); // ✅ don’t append empty/null fields
      }
    });

      if (editingId) {
        await axios.put(`https://backend-1-8lk6.onrender.com/api/products/${editingId}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Product updated successfully");
      } else {
        await axios.post("https://backend-1-8lk6.onrender.com/api/products", fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Start editing
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      image: null,
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          🌱 Manage Products
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Add / Edit Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          {editingId ? <FaSyncAlt /> : <FaPlus />}
          {editingId ? "Edit Product" : "Add New Plant"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={form.discount}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="flowering">Flowering</option>
          <option value="succulent">Succulent</option>
          <option value="seeds">Seeds</option>
          <option value="pots">Pots</option>
          <option value="gifts">Gifts</option>
        </select>
        <input type="file" name="image" onChange={handleChange} />

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            {editingId ? <FaSyncAlt /> : <FaPlus />}
            {editingId ? "Update Product" : "Add Plant"}
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

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-xl p-4">
            <img
              src={
                product.image
                  ? `https://backend-1-8lk6.onrender.com${product.image}`
                  : "/images/plant-placeholder.png"
              }
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-bold text-green-700">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-800 font-semibold">₹{product.price}</p>
            {product.discount > 0 && (
              <p className="text-red-500">Discount: {product.discount}%</p>
            )}
            <p className="text-sm text-gray-500">Category: {product.category}</p>
            <p className="text-sm text-gray-600">Stock: {product.stock}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(product._id)}
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

export default ManageProducts;
