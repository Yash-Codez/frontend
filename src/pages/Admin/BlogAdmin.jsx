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

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Form input handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ title: "", content: "", author: "", image: "" });
    setEditingId(null);
  };

  // Add or Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `https://backend-1-8lk6.onrender.com/api/blogs/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Blog updated successfully");
      } else {
        await axios.post("https://backend-1-8lk6.onrender.com/api/blogs", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Blog added successfully");
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: blog.image,
    });
    setEditingId(blog._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          📝 Manage Blogs
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Add / Edit Blog Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          {editingId ? <FaSyncAlt /> : <FaPlus />}
          {editingId ? "Edit Blog" : "Add New Blog"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={form.author}
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
          name="content"
          placeholder="Blog Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 h-32"
          required
        ></textarea>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
          >
            {editingId ? <FaSyncAlt /> : <FaPlus />}
            {editingId ? "Update Blog" : "Add Blog"}
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

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-md rounded-xl p-4">
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-bold text-green-700">{blog.title}</h3>
            <p className="text-gray-600 text-sm">✍️ {blog.author}</p>
            <p className="text-gray-600 mt-2">{blog.content}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(blog)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaEdit /> Update
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
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

export default BlogAdmin;
