import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
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

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPayment, setNewPayment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

    const fetchAddresses = async () => {
      try {
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    const fetchPayments = async () => {
      try {
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/payment-methods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaymentMethods(res.data);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };

    fetchProfile();
    fetchAddresses();
    fetchPayments();
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const address = res.data.display_name;
          setProfile((prev) => ({ ...prev, address }));
        } catch (err) {
          console.error("Error fetching address:", err);
          alert("Could not fetch address. Please try again.");
        }
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
      }
    );
  };

  const addAddress = async () => {
    if (!newAddress.trim()) return alert("Enter address");
    try {
      const res = await axios.post(
        "https://backend-1-8lk6.onrender.com/api/auth/addresses",
        { addressLine: newAddress, type: "Home" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses([...addresses, res.data]);
      setNewAddress("");
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/auth/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter((addr) => addr._id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const addPayment = async () => {
    if (!newPayment.trim()) return alert("Enter UPI/Card info");
    try {
      const res = await axios.post(
        "https://backend-1-8lk6.onrender.com/api/auth/payment-methods",
        { type: "UPI", upiId: newPayment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentMethods([...paymentMethods, res.data]);
      setNewPayment("");
    } catch (err) {
      console.error("Error adding payment:", err);
    }
  };

  const deletePayment = async (id) => {
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/auth/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(paymentMethods.filter((pm) => pm._id !== id));
    } catch (err) {
      console.error("Error deleting payment method:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 px-6">
      {/* ✅ Header with Back Button */}
      <div className="flex justify-between items-center w-full max-w-lg mb-6">
        <h2 className="text-2xl font-bold text-green-800">🌱 {profile.username || "User"}'s Profile</h2>
        <Link
          to="/user-dashboard"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full border-t-4 border-green-700">
        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer">
            <img
              src={preview || "/images/profile-placeholder.png"}
              alt="User"
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

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Name, Email, Contact, Address */}
          <div>
            <label className="block text-green-800 font-medium mb-1">Name</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-green-800 font-medium mb-1">Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={profile.address || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                📍
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click 📍 to auto-fill your current location.
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </form>

        {/* Saved Addresses */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">📍 Saved Addresses</h3>
          {addresses.map((addr) => (
            <div key={addr._id} className="flex justify-between items-center border p-2 rounded mb-2 text-gray-800">
              <p>{addr.type}: {addr.addressLine}</p>
              <button
                onClick={() => deleteAddress(addr._id)}
                className="text-red-600">❌</button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={addAddress}
              className="px-3 py-2 bg-green-600 text-white rounded">Add</button>
          </div>
        </div>

        {/* Saved Payment Methods */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">💳 Payment Methods</h3>
          {paymentMethods.map((pm) => (
            <div key={pm._id} className="flex justify-between items-center border p-2 rounded mb-2 text-gray-800">
              <p>{pm.type === "Card" ? `Card: ${pm.cardNumber}` : `UPI: ${pm.upiId}`}</p>
              <button
                onClick={() => deletePayment(pm._id)}
                className="text-red-600">❌</button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newPayment}
              onChange={(e) => setNewPayment(e.target.value)}
              placeholder="Enter UPI ID or Card"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={addPayment}
              className="px-3 py-2 bg-green-600 text-white rounded">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
