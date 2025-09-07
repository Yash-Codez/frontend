import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://backend-1-8lk6.onrender.com/messages`, form);
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-center bg-cover text-left py-16 min-h-[300px] flex items-center"
        style={{ backgroundImage: `url("/images/banner1.png")` }}
      >
        <div className="relative z-10 max-w-2xl px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-white drop-shadow">
            We’d love to hear from you! Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="grid md:grid-cols-2 gap-10 px-6 py-12">
        {/* Left - Contact Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white p-6 shadow-md rounded-xl border-l-4 border-green-700">
            <MapPin className="text-green-700" size={28} />
            <div>
              <h3 className="font-bold text-green-800">Our Store</h3>
              <p className="text-gray-600">Hazratganj, Lucknow, India</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 shadow-md rounded-xl border-l-4 border-green-700">
            <Phone className="text-green-700" size={28} />
            <div>
              <h3 className="font-bold text-green-800">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 shadow-md rounded-xl border-l-4 border-green-700">
            <Mail className="text-green-700" size={28} />
            <div>
              <h3 className="font-bold text-green-800">Email</h3>
              <p className="text-gray-600">support@lucknowplants.com</p>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form
          className="bg-white p-8 rounded-xl shadow-md border"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Send us a Message
          </h2>

          <div className="mb-4">
            <label className="block text-green-800 mb-2">Name</label>
            <input
              type="text"
              name="name"   // ✅ added
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-green-800 mb-2">Email</label>
            <input
              type="email"
              name="email"  // ✅ added
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-green-800 mb-2">Message</label>
            <textarea
              rows="4"
              name="message"  // ✅ added
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-800 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>

          {status && <p className="mt-4 text-green-700 font-medium">{status}</p>}
        </form>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-12">
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;
