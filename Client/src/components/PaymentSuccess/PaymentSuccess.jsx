import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import bg from "../../assets/cover.jpg";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bg} alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-bean via-transparent to-coffee-bean/50"></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl m-4 transform transition-all hover:scale-[1.01]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle className="text-green-600 w-10 h-10" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-coffee-bean mb-2">Order Confirmed</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for choosing brewstore. Your payment has been processed successfully.
        </p>

        <div className="space-y-4">
          <Link
            to="/my-orders"
            className="block w-full bg-coffee-bean text-white py-3.5 rounded-xl font-bold hover:bg-caramel transition-all shadow-lg hover:shadow-caramel/20"
          >
            Track My Order
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full text-gray-500 font-semibold hover:text-coffee-bean transition-colors py-2"
          >
            Back to Shop <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>A confirmation email has been sent to your inbox.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
