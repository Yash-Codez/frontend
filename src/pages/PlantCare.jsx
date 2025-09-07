import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function PlantCare() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get(`https://backend-1-8lk6.onrender.com/api/plant-care`);
        setTips(res.data);
      } catch (err) {
        console.error("Error fetching plant care tips:", err);
      }
    };
    fetchTips();
  }, []);

  return (
      <div className="font-sans bg-green-50 min-h-screen">
      <Navbar/>
    
    <section className="px-6 py-12 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-8">🌼 Plant Care Tips</h1>
      {tips.length === 0 ? (
        <p className="text-gray-600">No plant care tips available yet.</p>
      ) : (
        tips.map((tip) => (
          <div key={tip._id} className="bg-white shadow-md rounded-xl p-6 mb-6">
            {tip.image && (
              <img
                src={tip.image}
                alt={tip.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-green-800">{tip.title}</h2>
            <p className="mt-2 text-gray-700">{tip.description}</p>
          </div>
        ))
      )}
    </section>
    </div>
  );
}
