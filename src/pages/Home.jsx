import React from "react";
import Navbar from "../components/Navbar";
import PopularSection from "../components/PopularSection";
import { FaCcAmazonPay } from "react-icons/fa"; // as placeholder for Paytm
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"; 
import { FaUniversity } from "react-icons/fa"; // Placeholder for UPI
import { CheckCircle, RefreshCw, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  
} from "lucide-react";

const Home = () => {
   const navigate = useNavigate();
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
       <section
      className="relative bg-center bg-cover text-left py-16 min-h-[400px] flex items-center"
      style={{ backgroundImage: `url("/images/banner1.png")` }}
    >
      <div className="relative z-10 max-w-2xl px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Fresh Lucknow Plants <br /> Delivered in 24 Hours
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-8 py-4 bg-green-800 text-white rounded-xl shadow-lg text-lg hover:bg-green-700 transition"
        >
          Shop Now
        </button>
      </div>
    </section>
      {/* Popular Section */}
      <PopularSection />

      {/* Feature Highlights */}
      <section className="flex flex-col md:flex-row justify-center gap-6 px-6 py-10">
        <div className="flex items-center gap-3 bg-white shadow-md rounded-xl p-4 w-full md:w-1/3 border-2 border-green-800">
          <CheckCircle className="text-[#facc15]" size={28} />
          <span className="flex flex-col text-green-800">
            <span className="font-bold uppercase text-lg leading-tight">
              Healthy
            </span>
            <span className="uppercase text-sm tracking-wide">
              Plant Guarantee
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white shadow-md rounded-xl p-4 w-full md:w-1/3 border-2 border-green-600">
          <Truck className="text-[#facc15]" size={28} />
          <span className="flex flex-col text-green-800">
            <span className="font-bold uppercase text-lg leading-tight">
              Same Day
            </span>
            <span className="uppercase text-sm tracking-wide">
              Lucknow Delivery
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white shadow-md rounded-xl p-4 w-full md:w-1/3 border-2 border-green-600">
          <RefreshCw className="text-[#facc15]" size={28} />
          <span className="flex flex-col text-green-800">
            <span className="font-bold uppercase text-lg leading-tight">
              Easy
            </span>
            <span className="uppercase text-sm tracking-wide">
              Replacement
            </span>
          </span>
        </div>
      </section>

      {/* Plant Care & Blog Section */}
        {/* Plant Care & Blog Section */}
      <section className="grid md:grid-cols-2 gap-6 px-6 py-10">
        {/* Plant Care Tip Card */}
        <div className="flex items-center justify-between bg-[#d6fbe4] rounded-xl shadow-md p-6">
          {/* Content Left */}
          <div className="text-left max-w-[60%] text-green-800">
            <h3 className="text-2xl font-bold mb-2">PLANT CARE TIP</h3>
            <p className="mb-4 text-xl">How to propagate pothos</p>
            <button
              onClick={() => navigate("/care")} // ✅ send user to /care
              className="px-5 py-2 bg-green-800 text-white rounded-lg"
            >
              Learn More
            </button>
          </div>
          {/* Image Right */}
          <img
            src="/images/pla1-Photoroom.png"
            alt="Plant Care"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Latest Blog Card */}
        <div className="flex items-center justify-between bg-[#d7e1f2] rounded-xl shadow-md p-6">
          {/* Content Left */}
          <div className="text-left max-w-[60%] text-green-800">
            <h3 className="text-2xl font-bold mb-2">LATEST BLOG</h3>
            <p className="mb-4 text-xl">The best plants for balconies</p>
            <button
              onClick={() => navigate("/blog")} // ✅ send user to /blog
              className="px-5 py-2 bg-green-800 text-white rounded-lg"
            >
              Read More
            </button>
          </div>
          {/* Image Right */}
          <img
            src="/images/plant1-Photoroom.png"
            alt="Blog"
            className="w-32 h-32 object-contain"
          />
        </div>
      </section>


      {/* Customer Testimonial */}
      <section className="px-6 py-10 bg-white text-green-800">
        <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
        <div className="bg-gray-50 border rounded-xl p-6 shadow-md flex items-start gap-4">
          <img
            src="/images/profile.jpeg"
            alt="Customer"
            className="w-14 h-14 rounded-full"
          />
          <div>
            <p className="text-green-800 mb-2">
              “The plants I received are in excellent condition. I’m really
              happy with my purchase!”
            </p>
            <p className="font-medium text-green-800">Asha, Hazratganj</p>
          </div>
        </div>
      </section>

      {/* Payment + Social Section */}
      <section className="bg-white text-green-800 px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Payments */}
        <div className="flex items-center gap-6 text-3xl">
          {/* UPI Placeholder */}
          <FaUniversity className="hover:text-green-900 transition cursor-pointer" />
          {/* Paytm */}
          <SiPaytm className="hover:text-green-900 transition cursor-pointer" />
          {/* PhonePe */}
          <SiPhonepe className="hover:text-green-900 transition cursor-pointer" />
          {/* GPay */}
          <SiGooglepay className="hover:text-green-900 transition cursor-pointer" />
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6 text-2xl">
          <Twitter className="cursor-pointer hover:text-green-900 transition" />
          <Instagram className="cursor-pointer hover:text-green-900 transition" />
          <Facebook className="cursor-pointer hover:text-green-900 transition" />
          <Linkedin className="cursor-pointer hover:text-green-900 transition" />
        </div>
      </div>
    </section>
    </div>
  );
};

export default Home;
