import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
  username: "",
  email: "",
  contact: "",
  password: "",
  role: "user",
  securityQuestion: "",
  securityAnswer: ""
});


  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`https://backend-1-8lk6.onrender.com/api/auth/signup`, form);

      // save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", form.role);

      // redirect to dashboard
     navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border-t-4 border-green-700">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Create Your Account 🌿
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-green-800 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
                placeholder="Enter your name"
              />
            </div>

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

            {/* Contact */}
            <div>
              <label className="block text-green-800 font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
                placeholder="Enter your contact number"
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

            {/* Security Question */}
<div>
  <label className="block text-green-800 font-medium mb-1">Security Question</label>
  <select
    name="securityQuestion"
    value={form.securityQuestion}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
    required
  >
    <option value="">Select a question</option>
    <option value="What is your favorite color?">What is your favorite color?</option>
    <option value="What is your pet's name?">What is your pet's name?</option>
    <option value="What city were you born in?">What city were you born in?</option>
  </select>
</div>

{/* Security Answer */}
<div>
  <label className="block text-green-800 font-medium mb-1">Security Answer</label>
  <input
    type="text"
    name="securityAnswer"
    value={form.securityAnswer}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
    placeholder="Enter your answer"
  />
</div>


            {/* Role Selection */}
            <div>
              <label className="block text-green-800 font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-green-700 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
