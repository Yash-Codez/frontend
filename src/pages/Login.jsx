import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`https://backend-1-8lk6.onrender.com/api/auth/login`, form);

      // Save token + role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "delivery") {
        navigate("/delivery-dashboard"); // ✅ new delivery boy dashboard
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border-t-4 border-green-700">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Welcome Back 🌱
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-green-800 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-green-800 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-green-700 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>

          {/* Forgot Password */}
          <p className="text-sm text-gray-600 mt-2 text-center">
            <a
              href="/forgot-password"
              className="text-green-700 font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
