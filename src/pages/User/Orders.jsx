import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [reasonDrafts, setReasonDrafts] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // ✅ Cancel order
  const handleCancel = async (orderId) => {
    if (!reasonDrafts[orderId]) return alert("Please enter a reason to cancel.");
    setLoadingId(orderId);
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${orderId}/cancel`,
        { reason: reasonDrafts[orderId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
      setReasonDrafts((prev) => ({ ...prev, [orderId]: "" }));
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to cancel order");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Request return
  const handleReturn = async (orderId) => {
    if (!reasonDrafts[orderId])
      return alert("Please enter a reason to request return.");
    setLoadingId(orderId);
    try {
      await axios.put(
        `https://backend-1-8lk6.onrender.com/api/orders/${orderId}/return`,
        { reason: reasonDrafts[orderId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
      setReasonDrafts((prev) => ({ ...prev, [orderId]: "" }));
      alert("Return requested successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to request return");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* ✅ Header with Back to Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-900">
          📦 My Orders ({orders.length})
        </h1>
        <Link
          to="/user-dashboard"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-900">No orders yet.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const currentStatus = order.isCancelled
              ? "Cancelled"
              : order.returnRequested
              ? "Return Requested"
              : order.deliveryStatus && order.deliveryStatus !== "Unassigned"
              ? order.deliveryStatus
              : order.status;

            return (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-xl p-4 text-gray-900"
              >
                <p className="font-bold text-green-900">
                  Order ID: {order._id}
                </p>
                <p>
                  Status:{" "}
                  <span className="font-semibold text-gray-900">
                    {currentStatus}
                  </span>
                </p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Address: {order.address}</p>

                <div className="mt-2">
                  {order.cartItems.map((item) => (
                    <p key={item._id}>
                      {item.product?.name} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  ))}
                </div>

                {/* ✅ Action Box */}
                {!order.isCancelled && !order.returnRequested && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <textarea
                      className="w-full border p-2 rounded mb-2"
                      placeholder="Enter reason..."
                      value={reasonDrafts[order._id] || ""}
                      onChange={(e) =>
                        setReasonDrafts((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                    ></textarea>

                    {/* Cancel before shipped */}
                    {["Pending", "Confirmed"].includes(order.status) && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={loadingId === order._id}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full mb-2"
                      >
                        {loadingId === order._id
                          ? "Cancelling..."
                          : "❌ Cancel Order"}
                      </button>
                    )}

                    {/* Return after delivered */}
                    {order.status === "Delivered" && (
                      <button
                        onClick={() => handleReturn(order._id)}
                        disabled={loadingId === order._id}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg w-full"
                      >
                        {loadingId === order._id
                          ? "Requesting..."
                          : "🔄 Request Return"}
                      </button>
                    )}
                  </div>
                )}

                {/* ✅ Track Order Button */}
                <div className="mt-4">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                  >
                    🚚 Track Order
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
