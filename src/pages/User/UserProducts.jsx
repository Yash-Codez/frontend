import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const token = localStorage.getItem("token");

  // fetch products with filters
  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        )
      ).toString();

      const res = await axios.get(
        `https://backend-1-8lk6.onrender.com/api/products?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  // handle filter input change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // add to cart
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation(); // prevent parent click
    try {
      await axios.post(
        "https://backend-1-8lk6.onrender.com/api/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    }
  };

  // add to wishlist
  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation(); // prevent parent click
    try {
      await axios.post(
        "https://backend-1-8lk6.onrender.com/api/wishlist",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Failed to add to wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">🌱 All Products</h1>
        <Link
          to="/user-dashboard"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      {/* Search Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow-md p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
          <option value="flowering">Flowering</option>
          <option value="succulent">Succulent</option>
          <option value="seeds">Seeds</option>
          <option value="pots">Pots</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
        >
          🔍 Search
        </button>
      </form>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const discountedPrice =
            product.discount > 0
              ? (
                  product.price -
                  (product.price * product.discount) / 100
                ).toFixed(2)
              : product.price;

          return (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer"
            >
              {/* Link only for image & name */}
              <Link to={`/products/${product._id}`}>
               <img
                  src={
  product.image
    ? `https://backend-1-8lk6.onrender.com${product.image}`
    : "/images/plant-placeholder.png"
}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold text-green-800">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-600">{product.description}</p>

              {product.discount > 0 ? (
                <div className="mt-2">
                  <p className="text-gray-500 line-through">₹{product.price}</p>
                  <p className="text-green-700 font-bold text-lg">
                    ₹{discountedPrice}
                  </p>
                  <p className="text-red-500 text-sm">
                    Save {product.discount}%
                  </p>
                </div>
              ) : (
                <p className="text-green-800 font-semibold">₹{product.price}</p>
              )}

              <p className="text-sm text-gray-500 mt-1">
                Category: {product.category}
              </p>
              <p
                className={`text-sm font-medium ${
                  product.stock === 0 ? "text-red-600" : "text-gray-600"
                }`}
              >
                {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
              </p>

              {/* Buttons outside the Link */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={(e) => handleAddToCart(product._id, e)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={(e) => handleAddToWishlist(product._id, e)}
                  className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <FaHeart size={18} /> Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserProducts;
