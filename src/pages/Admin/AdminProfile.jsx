import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    contact: "",
    address: "",
    profilePhoto: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setPreview(
          res.data.profilePhoto
            ? `https://backend-1-8lk6.onrender.com${res.data.profilePhoto}`
            : ""
        );
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setProfile({ ...profile, profilePhoto: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("contact", profile.contact);
      formData.append("address", profile.address);
      if (profile.profilePhoto instanceof File) {
        formData.append("profilePhoto", profile.profilePhoto);
      }

      const res = await axios.put(
        "https://backend-1-8lk6.onrender.com/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data);
      if (res.data.profilePhoto) {
        setPreview(`https://backend-1-8lk6.onrender.com${res.data.profilePhoto}`);
      }
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full border-t-4 border-green-700">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            🌱 {profile.username || "Admin"}'s Profile
          </h2>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer">
            <img
              src={preview || "/images/profile-placeholder.png"}
              alt="Admin"
              className="w-24 h-24 rounded-full border-2 border-green-700 object-cover"
            />
            <input
              type="file"
              name="profilePhoto"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-green-800 font-medium mb-1">Name</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-green-800 font-medium mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-green-800 font-medium mb-1">
              Contact
            </label>
            <input
              type="text"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-green-800 font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700"
            />
          </div>

          {/* Save + Logout */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
