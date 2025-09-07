// src/pages/About.jsx
import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
     <div className="font-sans bg-green-50 min-h-screen">
      <Navbar/>
    <section className="bg-gray-50 min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-left">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-8">
          About Us
        </h2>

        {/* Intro */}
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Welcome to <span className="font-semibold text-green-800">Lucknow Plants Nursery</span>, 
          your trusted partner in bringing nature closer to your home. Since our inception, 
          we have been committed to spreading greenery, one plant at a time.
        </p>

        {/* Mission Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-green-700 mb-4">🌱 Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to create a greener and healthier environment by 
            delivering fresh plants right to your doorstep. We believe plants 
            not only beautify spaces but also improve mental well-being, air quality, 
            and foster positivity in every home.
          </p>
        </div>

        {/* Staff Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-green-700 mb-4">👩‍🌾 Our Team</h3>
          <p className="text-gray-700 leading-relaxed">
            Behind every plant is a dedicated team of horticulturists, gardeners, 
            and plant enthusiasts who carefully nurture each sapling before it 
            reaches you. Our staff is passionate about nature and always ready to 
            guide you in selecting and caring for your plants.
          </p>
        </div>

        {/* History Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-green-700 mb-4">📖 Our History</h3>
          <p className="text-gray-700 leading-relaxed">
            Founded in the heart of Lucknow, our nursery has grown from a small 
            family-owned garden into a trusted plant delivery service. Over the years, 
            we have proudly served thousands of happy customers who share our passion 
            for greenery and sustainable living.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-10">
          <button className="px-8 py-4 bg-green-800 text-white rounded-xl shadow-lg text-lg hover:bg-green-700 transition">
            Explore Our Plants
          </button>
        </div>
      </div>
    </section>
    </div>
  );
};

export default About;
