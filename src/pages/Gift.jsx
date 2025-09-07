import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Gift() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // fetch gift products
  const fetchGifts = async () => {
    try {
      const res = await axios.get(`https://backend-1-8lk6.onrender.com/api/products?category=gifts`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching gift products:", err);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return (
     <div className="font-sans bg-green-50 min-h-screen">
      <Navbar/>
    <section className="px-6 py-12 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-8">🎁 Gift Plants & Hampers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const discountedPrice =
            product.discount > 0
              ? (product.price - (product.price * product.discount) / 100).toFixed(2)
              : product.price;

          return (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={
                    product.image
                      ? `http://localhost:5000${product.image}`
                      : "/images/plant-placeholder.png"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-green-800">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>

                {/* ✅ Price Section */}
                {product.discount > 0 ? (
                  <div className="mt-2">
                    <p className="text-gray-500 line-through">₹{product.price}</p>
                    <p className="text-green-700 font-bold text-lg">₹{discountedPrice}</p>
                    <p className="text-red-500 text-sm">Save {product.discount}%</p>
                  </div>
                ) : (
                  <p className="text-green-700 font-bold mt-2">₹{product.price}</p>
                )}

                {/* ✅ Stock Info */}
                <p
                  className={`text-sm font-medium mt-1 ${
                    product.stock === 0 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                </p>

                {/* ✅ Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart size={18} /> Add to Cart
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    <FaHeart size={18} /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
    </div>
  );
}
