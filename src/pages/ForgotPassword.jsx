import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://backend-1-8lk6.onrender.com/api/auth/forgot-password`, { email });
      setQuestion(res.data.question);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "User not found");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { email, answer, newPassword });
      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border-t-4 border-green-700">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Reset Password 🔑</h2>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email"
                className="w-full border rounded-lg px-4 py-2" required />
              <button className="w-full bg-green-700 text-white py-2 rounded-lg">Continue</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-gray-700">{question}</p>
              <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter your answer"
                className="w-full border rounded-lg px-4 py-2" required />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password" className="w-full border rounded-lg px-4 py-2" required />
              <button className="w-full bg-green-700 text-white py-2 rounded-lg">Reset Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
