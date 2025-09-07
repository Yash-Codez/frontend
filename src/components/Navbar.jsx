import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-green-800">
        <Link to="/">🌱 प्रभुजी नर्सरी</Link>
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-6 text-green-800 font-medium">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">Shop Plants</Link>
        </li>
        <li>
          <Link to="/seeds">Seeds & Pots</Link>
        </li>
        <li>
          <Link to="/gifts">Gifts</Link>
        </li>
        <li>
          <Link to="/care">Plant Care</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      {/* Search Icon */}
      <button className="text-gray-600 text-xl">🔍</button>
    </nav>
  );
};

export default Navbar;
