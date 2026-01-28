import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import bgImage from "../../assets/cover.jpg";
import { verifyFormDataIntegrity, verifyAPIResponseIntegrity } from '../../utils/integrityUtils';
import { Coffee, User, Mail, Lock, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const validateName = (name) => /^[A-Za-z\s]{2,}$/.test(name.trim());
  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const validatePassword = (password) => {
    if (password.length < 8) return false;
    return /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
    return score;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Integrity check
    const registrationData = { name: form.name, email: form.email, password: form.password };
    if (!verifyFormDataIntegrity(registrationData, 'registration')) {
      toast.error("Invalid registration data detected.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        token: form.token,
      });

      if (!verifyAPIResponseIntegrity(response)) {
        toast.error("Invalid response from server");
        return;
      }

      toast.success("Account created! Please check your email.");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error Response:", error.response?.data);
      toast.error(error.response?.data?.msg || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["bg-gray-700", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Empty", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden py-12">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-bl from-coffee-bean/90 to-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.005]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-cream mb-2">Join the Roast</h1>
            <p className="text-latte/80 text-sm font-light">Create your brewstore account today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-caramel uppercase tracking-wider ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-caramel transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-black/30">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-all duration-500 ${passwordStrength > i ? strengthColors[passwordStrength] : "bg-transparent"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-right text-gray-400">{strengthLabels[passwordStrength]}</p>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <ReCAPTCHA theme="dark" sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={(t) => setForm({ ...form, token: t })} />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-caramel to-[#b08055] hover:to-caramel text-coffee-bean font-bold py-3.5 rounded-xl shadow-lg hover:shadow-caramel/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Start Brewing"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-caramel font-semibold hover:text-white transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
