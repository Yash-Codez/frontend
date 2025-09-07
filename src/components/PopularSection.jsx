import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const items = [
  { name: "Indoor Plants", img: "/images/plant1.png" },
  { name: "Outdoor Plants", img: "/images/plant2.png" },
  { name: "Air-Purifying Plants", img: "/images/plant3.png" },
  { name: "Seeds", img: "/images/plant4.png" },
  { name: "Indoor Plants", img: "/images/plant1.png" },
  { name: "Outdoor Plants", img: "/images/plant2.png" },
  { name: "Air-Purifying Plants", img: "/images/plant3.png" },
  { name: "Seeds", img: "/images/plant4.png" },
  { name: "Indoor Plants", img: "/images/plant1.png" },
  { name: "Outdoor Plants", img: "/images/plant2.png" },
  { name: "Air-Purifying Plants", img: "/images/plant3.png" },
  { name: "Seeds", img: "/images/plant4.png" },
];

const PopularSection = () => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (dir === "left") {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative px-6 py-8">
      <h2 className="text-2xl font-bold mb-4">Popular For You</h2>
      <div className="flex items-center relative">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="p-2 bg-green-800 text-white rounded-full shadow-md absolute left-0 z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth w-full"
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[180px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Full image inside card */}
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              {/* Darker Text below image */}
              <p className="font-semibold text-green-800 text-center py-2">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="p-2 bg-green-800 text-white rounded-full shadow-md absolute right-0 z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default PopularSection;
