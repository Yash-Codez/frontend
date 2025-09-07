import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaHeart, FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const validItems = res.data.filter((item) => item.product);
      setCart(validItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch saved addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("https://backend-1-8lk6.onrender.com/api/auth/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data);
      if (res.data.length > 0) setSelectedAddress(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // Fetch payment methods
  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        "https://backend-1-8lk6.onrender.com/api/auth/payment-methods",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentMethods(res.data);
      if (res.data.length > 0) setSelectedPayment(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchPayments();
  }, []);

  // Remove item
  const handleRemove = async (id) => {
    try {
      await axios.delete(`https://backend-1-8lk6.onrender.com/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Move to wishlist
  const moveToWishlist = async (productId, cartId) => {
    try {
      await axios.post(
        "http://localhost:5000https://backend-1-8lk6.onrender.com/api/wishlist",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await handleRemove(cartId);
    } catch (err) {
      console.error("Error moving to wishlist:", err);
    }
  };

  // Payment handler (same as before)
  const handlePayment = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert("Please select address & payment method.");
      return;
    }
    try {
      const res = await fetch("https://backend-1-8lk6.onrender.com/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal * 100,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_7WDKJozgjmggqG",
        amount: order.amount,
        currency: order.currency,
        name: "My Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const validateRes = await fetch(
            "https://backend-1-8lk6.onrender.com/api/payments/order/validate",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );
          const jsonRes = await validateRes.json();

          if (jsonRes.msg === "Transaction successful") {
            await axios.post(
              "https://backend-1-8lk6.onrender.com/api/orders",
              {
                cart,
                totalAmount: finalTotal,
                addressId: selectedAddress,
                paymentMethodId: selectedPayment,
                paymentId: jsonRes.paymentId,
                orderId: jsonRes.orderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ Payment successful & order placed!");
            setCart([]);
          } else {
            alert("❌ Payment validation failed!");
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  // Totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) =>
      sum + (item.product.price * item.product.discount * item.quantity) / 100,
    0
  );
  const finalTotal = subtotal - totalDiscount;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          🛒 My Cart ({cart.length} items)
        </h1>
        <button
          onClick={() => navigate("/user-dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-green-800">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products */}
          <div className="md:col-span-2 grid gap-6">
            {cart.map((item) => {
              const discountedPrice =
                item.product.discount > 0
                  ? (
                      item.product.price -
                      (item.product.price * item.product.discount) / 100
                    ).toFixed(2)
                  : item.product.price;

              return (
                <div key={item._id} className="bg-white shadow-md rounded-xl p-4">
                  {/* ✅ Clickable Image & Name */}
                  <Link to={`/products/${item.product._id}`}>
                    <img
                      src={
                        item.product.image
                          ? `http://localhost:5000${item.product.image}`
                          : "/images/plant-placeholder.png"
                      }
                      alt={item.product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3 hover:opacity-80 transition"
                    />
                    <h3 className="text-lg font-bold text-green-800 hover:underline">
                      {item.product.name}
                    </h3>
                  </Link>

                  <p className="text-gray-600">{item.product.description}</p>

                  {item.product.discount > 0 ? (
                    <div className="mt-2">
                      <p className="line-through text-gray-500">
                        ₹{item.product.price}
                      </p>
                      <p className="text-green-700 font-bold text-lg">
                        ₹{discountedPrice}
                      </p>
                      <p className="text-red-500 text-sm">
                        Save {item.product.discount}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-green-800 font-semibold">
                      ₹{item.product.price}
                    </p>
                  )}

                  <p className="text-sm">Qty: {item.quantity}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      <FaTrash /> Remove
                    </button>
                    <button
                      onClick={() =>
                        moveToWishlist(item.product._id, item._id)
                      }
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg"
                    >
                      <FaHeart /> Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Checkout section unchanged */}
          <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
            <h2 className="text-lg font-bold text-green-800 mb-4">
              Price Details
            </h2>
            <p className="flex justify-between text-gray-700">
              <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-red-500">
              <span>Discount</span> <span>-₹{totalDiscount.toFixed(2)}</span>
            </p>
            <hr className="my-2" />
            <p className="flex justify-between text-lg font-bold text-green-800">
              <span>Total</span> <span>₹{finalTotal.toFixed(2)}</span>
            </p>

            {/* Address */}
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-gray-800">Select Address</h3>
              {addresses.length > 0 ? (
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                >
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.type} - {addr.addressLine}, {addr.city}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  No saved addresses. Please add in Profile.
                </p>
              )}
            </div>

            {/* Payment */}
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-gray-800">
                Select Payment Method
              </h3>
              {paymentMethods.length > 0 ? (
                <select
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm._id} value={pm._id}>
                      {pm.type === "Card"
                        ? `Card (${pm.cardNumber})`
                        : `UPI (${pm.upiId})`}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500">
                  No saved payment methods. Please add in Profile.
                </p>
              )}
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 w-full px-4 py-2 bg-green-700 text-white rounded-lg"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
