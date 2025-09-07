import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaArrowLeft } from "react-icons/fa";

const COLORS = ["#16a34a", "#15803d", "#22c55e", "#4ade80"];

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    monthlySales: [],
    topProducts: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("https://backend-1-8lk6.onrender.com/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">📊 Analytics</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-700">Total Orders</h2>
          <p className="text-3xl font-bold text-green-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-900">₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart for Monthly Sales */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-700 mb-4">Monthly Sales</h2>
          <LineChart
            width={400}
            height={250}
            data={stats.monthlySales}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        {/* Pie Chart for Top Products */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-700 mb-4">Top Products</h2>
          <PieChart width={400} height={250}>
            <Pie
              data={stats.topProducts}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#16a34a"
              label
            >
              {stats.topProducts.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
