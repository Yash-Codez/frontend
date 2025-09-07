import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(
        "https://backend-1-8lk6.onrender.com/api/auth/delivery-boys",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeliveryBoys(res.data);
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      await axios.post(
        "https://backend-1-8lk6.onrender.com/api/orders/assign",
        { orderId, deliveryBoyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error assigning delivery boy:", err);
    }
  };

  const updateReturn = async (id, status) => {
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${id}/return-status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating return:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">📋 Admin Orders</h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md p-4 rounded-xl">
              <p className="font-bold">Order ID: {order._id}</p>
              <p>
                User: {order.user?.username} ({order.user?.email})
              </p>
              <p>Address: {order.address}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <p>Admin Status: {order.status}</p>
              <p>Delivery Status: {order.deliveryStatus}</p>

              {order.isCancelled && (
                <p className="text-red-600">
                  ❌ Cancelled (Reason: {order.cancelReason})
                </p>
              )}

              {order.returnRequested && (
                <div className="mt-2">
                  <p className="text-yellow-600">
                    🔄 Return Requested (Reason: {order.returnReason})
                  </p>
                  {order.returnStatus === "Pending" ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => updateReturn(order._id, "Approved")}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateReturn(order._id, "Rejected")}
                        className="bg-red-600 text-white px-3 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p>Return {order.returnStatus}</p>
                  )}
                </div>
              )}

              <div className="mt-3">
                <p className="font-medium">Assign Delivery Boy:</p>
                <select
                  className="border p-2 rounded w-full mt-1"
                  value={order.assignedTo?._id || ""}
                  onChange={(e) => assignDeliveryBoy(order._id, e.target.value)}
                >
                  <option value="">-- Select Delivery Boy --</option>
                  {deliveryBoys.map((boy) => (
                    <option key={boy._id} value={boy._id}>
                      {boy.username} ({boy.email})
                    </option>
                  ))}
                </select>
              </div>

              <select
                className="mt-3 border p-2 rounded bg-green-800 text-white"
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
