import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/api";
import toast from "react-hot-toast";
import bgImage from "../../assets/cover.jpg";
import { ShieldCheck, Timer, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";

export default function OTPVerification({ userId, email, originalLoginData, requires2FA, onVerificationSuccess }) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      let res;

      if (requires2FA) {
        // Step 1: Verify 2FA
        const verifyRes = await axios.post("/users/2fa/verify", {
          userId,
          code: otp,
        });

        if (verifyRes.data.msg !== "2FA verified") {
          toast.error("Invalid 2FA code");
          return;
        }

        // Step 2: Use returned user and tokens
        const { user } = verifyRes.data;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful! Welcome to brewstore!");
        if (onVerificationSuccess) onVerificationSuccess(user);
        user.isAdmin ? navigate("/admin") : navigate("/");
      } else {
        // OTP (email-based)
        res = await axios.post("/auth/login", {
          ...originalLoginData,
          userId,
          otpCode: otp,
        });

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login successful! Welcome to brewstore!");
          if (onVerificationSuccess) onVerificationSuccess(res.data.user);
          res.data.user.isAdmin ? navigate("/admin") : navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await axios.post("/auth/resend-otp", { userId });
      setTimeLeft(300);
      toast.success("New OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-30 animate-scale-slow" />
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-bean/95 via-coffee-bean/90 to-black/80 backdrop-blur-[2px]"></div>

        {/* Animated Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-caramel/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rich-roast/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 md:p-12 transform transition-all duration-500 hover:shadow-caramel/5 hover:border-white/20 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6 group/icon transition-transform hover:scale-105">
              <div className="p-3 bg-gradient-to-br from-caramel to-[#8B5E3C] rounded-full shadow-lg shadow-caramel/20">
                <ShieldCheck className="text-white w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-white mb-3 tracking-tight">
              {requires2FA ? "Two-Factor Authentication" : "Verify Your Login"}
            </h2>

            <p className="text-latte/70 text-sm font-light leading-relaxed">
              {requires2FA
                ? "Enter the 6-digit code from your authenticator app to continue."
                : (
                  <>
                    We've sent a 6-digit code to <span className="font-semibold text-caramel">{email}</span>
                  </>
                )
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-caramel/90 uppercase tracking-widest ml-1 block text-center">
                {requires2FA ? "Authenticator Code" : "Security Code"}
              </label>

              <div className="relative group/input">
                <input
                  type="text"
                  placeholder="0 0 0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 text-center text-3xl text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-caramel/50 focus:border-caramel/50 focus:bg-black/60 transition-all duration-300 font-serif tracking-[0.5em] shadow-inner"
                  maxLength={6}
                />


              </div>

              {/* Timer Indicator - Moved Below */}
              {!requires2FA && timeLeft > 0 && (
                <div className="flex justify-center items-center gap-2 text-xs font-medium text-caramel/80 animate-fade-in mt-2">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Expires in {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (timeLeft === 0 && !requires2FA)}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-caramel to-[#9D6B43] p-[1px] shadow-lg transition-all hover:shadow-caramel/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative h-full w-full bg-gradient-to-r from-caramel to-[#9D6B43] px-6 py-3.5 transition-all group-hover:bg-opacity-0">
                <span className="relative flex items-center justify-center gap-2 font-bold tracking-wide text-white">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <>
                      {requires2FA ? "Verify 2FA" : "Verify OTP"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </div>
            </button>

            {/* Resend / Expired State */}
            {timeLeft === 0 && !requires2FA && (
              <div className="text-center animate-fade-in">
                <p className="text-sm text-red-400 mb-2 font-medium">Code expired</p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 text-caramel hover:text-white transition-colors font-medium text-sm group/resend"
                >
                  <RefreshCw className={`w-3 h-3 ${resendLoading ? 'animate-spin' : 'group-hover/resend:rotate-180 transition-transform duration-500'}`} />
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            )}

            <div className="pt-2 text-center text-sm">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-caramel transition-colors group/back"
              >
                <ArrowLeft className="w-3 h-3 transition-transform group-hover/back:-translate-x-1" />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 