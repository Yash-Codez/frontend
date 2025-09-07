import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeliveryDashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAssigned = async () => {
    try {
      const res = await axios.get(
        "https://backend-1-8lk6.onrender.com/api/orders/delivery/assigned",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data);
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const updateDeliveryStatus = async (orderId, deliveryStatus, otp = null) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/delivery-status`,
        { deliveryStatus, deliveryNotes: noteDrafts[orderId] || "", otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdatingId(null);
      fetchAssigned();
    } catch (e) {
      console.error("Failed to update delivery status:", e.response?.data || e);
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          🚚 Delivery Boy Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        <div className="space-y-6 text-gray-800">
          {orders.map((o) => (
            <div key={o._id} className="bg-white shadow p-4 rounded-xl">
              <h2 className="font-bold">Order #{o._id}</h2>
              <p>Customer: {o.user?.username}</p>
              <p>Address: {o.address}</p>
              <p>Total: ₹{o.totalAmount}</p>
              <p>Status: {o.deliveryStatus}</p>

              {o.isCancelled && (
                <p className="text-red-600">❌ Cancelled by User</p>
              )}

              {o.returnRequested && (
                <p className="text-yellow-600">
                  🔄 Return {o.returnStatus} - Reason: {o.returnReason}
                </p>
              )}

              <div className="mt-3">
                {o.cartItems.map((item) => (
                  <p key={item._id}>
                    <FaBox className="inline text-green-700" />{" "}
                    {item.product?.name} × {item.quantity}
                  </p>
                ))}
              </div>

              {/* Notes */}
              <input
                type="text"
                placeholder="Add delivery note (optional)"
                value={noteDrafts[o._id] || ""}
                onChange={(e) =>
                  setNoteDrafts((prev) => ({ ...prev, [o._id]: e.target.value }))
                }
                className="mt-3 border px-3 py-2 rounded w-full"
              />

              {/* OTP Input */}
              {o.deliveryStatus !== "Delivered" && (
                <input
                  type="text"
                  placeholder="Enter OTP for delivery"
                  maxLength={6}
                  value={noteDrafts[o._id + "_otp"] || ""}
                  onChange={(e) =>
                    setNoteDrafts((prev) => ({
                      ...prev,
                      [o._id + "_otp"]: e.target.value,
                    }))
                  }
                  className="mt-2 border px-3 py-2 rounded w-full"
                />
              )}

              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => updateDeliveryStatus(o._id, "Out for Delivery")}
                  disabled={updatingId === o._id}
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Out for Delivery
                </button>

                <button
                  onClick={() => {
                    if (!noteDrafts[o._id + "_otp"]) {
                      alert("Please enter OTP before marking as Delivered");
                      return;
                    }
                    updateDeliveryStatus(
                      o._id,
                      "Delivered",
                      noteDrafts[o._id + "_otp"]
                    );
                  }}
                  disabled={updatingId === o._id}
                  className="bg-green-700 text-white px-3 py-2 rounded"
                >
                  Mark Delivered
                </button>

                <button
                  onClick={() => updateDeliveryStatus(o._id, "Failed")}
                  disabled={updatingId === o._id}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Failed
                </button>

                {o.deliveryStatus === "Return Pickup Pending" && (
                  <button
                    onClick={() =>
                      updateDeliveryStatus(o._id, "Return Picked Up")
                    }
                    className="bg-purple-600 text-white px-3 py-2 rounded"
                  >
                    Pickup Return
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
