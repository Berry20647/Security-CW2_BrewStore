import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../api/api";
import bgImage from "../../assets/cover.jpg";
import { Coffee, Lock, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-bean/90 to-rich-roast/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all hover:scale-[1.01]">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <Coffee className="text-caramel w-8 h-8 group-hover:rotate-12 transition-transform" />
              <h1 className="text-3xl font-serif font-bold text-cream">Brew<span className="text-caramel">Store</span></h1>
            </Link>
            <div className="flex justify-center mb-4">
              <div className="bg-caramel/20 p-4 rounded-full">
                <KeyRound className="w-10 h-10 text-caramel" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Create New Password</h2>
            <p className="text-latte/80 text-sm font-light">Enter a strong password to secure your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel focus:bg-black/30 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel focus:bg-black/30 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-caramel to-[#b08055] hover:to-caramel text-coffee-bean font-bold py-3.5 rounded-xl shadow-lg hover:shadow-caramel/20 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {loading ? <span className="animate-pulse">Resetting...</span> : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
