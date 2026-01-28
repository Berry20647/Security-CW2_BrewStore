import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Check } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg border border-latte/20 animate-fade-in-up">

        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-caramel rounded-full opacity-20 animate-ping"></div>
          <div className="relative bg-coffee-bean text-caramel p-6 rounded-full shadow-lg">
            <Coffee size={40} />
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-4 border-white">
              <Check size={12} strokeWidth={4} />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-serif font-bold text-coffee-bean mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Your ethically sourced beans are getting ready for their journey.
        </p>

        <div className="bg-latte/10 rounded-xl p-6 mb-8 text-left border border-latte/20">
          <h3 className="font-bold text-coffee-bean mb-2 text-sm uppercase tracking-wider">Next Steps</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-caramel rounded-full"></span> You will receive an email confirmation shortly.</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-caramel rounded-full"></span> Our team will contact you for delivery coordination.</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-caramel rounded-full"></span> Payment on delivery (if chosen) will be collected.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-coffee-bean text-white font-bold py-3 px-6 rounded-xl hover:bg-caramel transition-all shadow-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 border-2 border-latte text-coffee-bean font-bold py-3 px-6 rounded-xl hover:bg-latte hover:border-transparent transition-all"
          >
            View Orders
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 font-medium">
          Redirecting to homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default Success;
