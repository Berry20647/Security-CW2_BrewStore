import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/api";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import bgImage from "../../assets/cover.jpg";
import { verifyFormDataIntegrity, verifyAPIResponseIntegrity } from '../../utils/integrityUtils';
import OTPVerification from "./OTPVerification";
import { Coffee, ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    if (!verifyFormDataIntegrity(loginData, 'login')) {
      toast.error("Invalid login data detected.");
      return;
    }

    setLoading(true);
    if (!recaptchaToken) {
      toast.error("Please verify you are human");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
        token: recaptchaToken,
      });

      if (!verifyAPIResponseIntegrity(res)) {
        toast.error("Invalid response from server");
        return;
      }

      if (res.data.twoFactorRequired) {
        setOtpData({
          userId: res.data.userId,
          email: res.data.email,
          originalLoginData: { email, password, token: recaptchaToken },
          requires2FA: true
        });
        setShowOTP(true);
        toast.success("2FA code required");
      } else if (res.data.otpRequired) {
        setOtpData({
          userId: res.data.userId,
          email: res.data.email,
          originalLoginData: { email, password, token: recaptchaToken }
        });
        setShowOTP(true);
        toast.success("OTP sent to your email");
      } else if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Welcome back to brewstore!");
        res.data.user.isAdmin ? navigate("/admin") : navigate("/");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (showOTP && otpData) {
    return (
      <OTPVerification
        userId={otpData.userId}
        email={otpData.email}
        originalLoginData={otpData.originalLoginData}
        requires2FA={otpData.requires2FA}
        onVerificationSuccess={(user) => {
          setUser(user);
          setShowOTP(false);
          setOtpData(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-bean/90 to-rich-roast/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <Coffee className="text-caramel w-8 h-8 group-hover:rotate-12 transition-transform" />
              <h1 className="text-3xl font-serif font-bold text-cream">Brew<span className="text-caramel">Store</span></h1>
            </Link>
            <p className="text-latte/80 text-sm font-light">Welcome back, coffee lover.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel focus:bg-black/30 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-caramel uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">Forgot?</Link>
              </div>
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

            <div className="flex justify-center pt-2">
              <ReCAPTCHA theme="dark" sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-caramel to-[#b08055] hover:to-caramel text-coffee-bean font-bold py-3.5 rounded-xl shadow-lg hover:shadow-caramel/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Brewing Access...</span>
              ) : (
                <>Brew In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              New to the roast?{" "}
              <Link to="/register" className="text-caramel font-semibold hover:text-white transition-colors">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
