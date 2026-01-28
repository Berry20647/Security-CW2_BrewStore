import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../../assets/cover.jpg";
import { Coffee, Mail, ArrowLeft, ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent! Check your email.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Failed to send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-30 animate-scale-slow" />
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-bean/95 via-coffee-bean/90 to-black/80 backdrop-blur-[2px]"></div>

        {/* Animated Orbs for visual interest */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-caramel/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rich-roast/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 md:p-12 transform transition-all duration-500 hover:shadow-caramel/5 hover:border-white/20 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-6 group/logo transition-transform hover:scale-105">
              <div className="p-2 bg-gradient-to-br from-caramel to-[#8B5E3C] rounded-xl shadow-lg shadow-caramel/20">
                <Coffee className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream to-latte tracking-wide">
                Brew<span className="text-caramel">Store</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-serif font-bold text-white mb-3 tracking-tight">Forgot Password?</h2>
            <p className="text-latte/70 text-sm font-light leading-relaxed">
              Don't worry, it happens to the best of us. Enter your email below to recover your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group/input">
              <label className="text-xs font-bold text-caramel/90 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-caramel">
                Email Address
              </label>
              <div className="relative transition-all duration-300 transform group-focus-within/input:scale-[1.02]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within/input:text-caramel" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-caramel/50 focus:border-caramel/50 focus:bg-black/60 transition-all duration-300 font-medium tracking-wide"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-caramel to-[#9D6B43] p-[1px] shadow-lg transition-all hover:shadow-caramel/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="relative h-full w-full bg-gradient-to-r from-caramel to-[#9D6B43] px-6 py-3.5 transition-all group-hover:bg-opacity-0">
                <span className="relative flex items-center justify-center gap-2 font-bold tracking-wide text-white">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-caramel transition-colors group/link"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover/link:-translate-x-1" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
