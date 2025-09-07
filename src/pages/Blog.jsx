import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`https://backend-1-8lk6.onrender.com/api/blogs`);
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="font-sans bg-green-50 min-h-screen">
<Navbar/>
  
    <section className="px-6 py-12 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-8">🌱 Gardening Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs available yet.</p>
      ) : (
        blogs.map((b) => (
          <div key={b._id} className="bg-white shadow-md rounded-xl p-6 mb-6">
            {b.image && (
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-green-800">{b.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              By {b.author || "Admin"}
            </p>
            <p className="mt-2 text-gray-700">{b.content.substring(0, 120)}...</p>
            <button className="mt-3 text-green-700 font-semibold hover:underline">
              Read More →
            </button>
          </div>
        ))
      )}
    </section>
      </div>
  );
}
