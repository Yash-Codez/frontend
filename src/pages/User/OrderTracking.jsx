import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const steps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Return Requested",
  "Return Pickup Pending",
  "Return Picked Up",
  "Return Completed",
];

const OrderTracking = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`https://backend-1-8lk6.onrender.com/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  // ✅ Cancel order
  const handleCancel = async () => {
    if (!actionReason) return alert("Please enter a reason to cancel.");
    setLoading(true);
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${id}/cancel`,
        { reason: actionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrder();
      setActionReason("");
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Request return
  const handleReturn = async () => {
    if (!actionReason) return alert("Please enter a reason to request return.");
    setLoading(true);
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${id}/return`,
        { reason: actionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrder();
      setActionReason("");
      alert("Return requested successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to request return");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  // ✅ Decide status
  let currentStatus;
  if (order.isCancelled) {
    currentStatus = "Cancelled";
  } else if (order.returnRequested) {
    currentStatus =
      order.returnStatus === "Approved"
        ? order.deliveryStatus
        : "Return Requested";
  } else {
    currentStatus =
      order.deliveryStatus && order.deliveryStatus !== "Unassigned"
        ? order.deliveryStatus
        : order.status;
  }

  const currentStepIndex = steps.findIndex(
    (s) => s.toLowerCase() === currentStatus.toLowerCase()
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        🚚 Track Your Order
      </h1>

      {/* Order Info */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4 text-gray-900">
        <p>
          <span className="font-semibold">Order ID:</span> {order._id}
        </p>
        <p>
          <span className="font-semibold">Total:</span> ₹{order.totalAmount}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {order.address}
        </p>
        <p>
          <span className="font-semibold">Current Status:</span>{" "}
          <span className="text-green-700 font-bold">{currentStatus}</span>
        </p>

        {order.isCancelled && (
          <p className="text-red-600 font-semibold mt-2">
            ❌ Cancelled (Reason: {order.cancelReason})
          </p>
        )}
        {order.returnRequested && (
          <p className="text-yellow-600 font-semibold mt-2">
            🔄 Return {order.returnStatus} (Reason: {order.returnReason})
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative flex justify-between items-center w-full mt-10">
        {/* Base line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 z-0"></div>

        {/* Progress line */}
        {currentStepIndex >= 0 && (
          <div
            className="absolute top-1/2 left-0 h-1 bg-green-600 z-10 transition-all duration-700"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        )}

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = currentStepIndex >= index;
          return (
            <div
              key={step}
              className="relative z-20 flex-1 flex flex-col items-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm text-center ${
                  isActive ? "text-green-700 font-semibold" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}

        {/* Moving Truck 🚚 (delivery flow) */}
        {currentStepIndex >= 0 && currentStepIndex <= 4 && (
          <div
            className="absolute top-[-28px] transition-all duration-700 z-30"
            style={{
              left: `${(currentStepIndex / 4) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-3xl">🚚</span>
          </div>
        )}

        {/* Box 📦 (return flow) */}
        {currentStepIndex > 4 && (
          <div
            className="absolute top-[-28px] transition-all duration-700 z-30"
            style={{
              left: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-3xl">📦</span>
          </div>
        )}
      </div>

      {/* ✅ Action Buttons */}
      {!order.isCancelled && !order.returnRequested && (
        <div className="mt-8 bg-white p-4 shadow rounded-lg">
          <textarea
            className="w-full border p-2 rounded mb-3"
            placeholder="Enter reason..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
          ></textarea>

          {/* Cancel before Shipped */}
          {["Pending", "Confirmed"].includes(order.status) && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full"
            >
              {loading ? "Cancelling..." : "❌ Cancel Order"}
            </button>
          )}

          {/* Request Return after Delivered */}
          {order.status === "Delivered" && (
            <button
              onClick={handleReturn}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg w-full"
            >
              {loading ? "Requesting..." : "🔄 Request Return"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
