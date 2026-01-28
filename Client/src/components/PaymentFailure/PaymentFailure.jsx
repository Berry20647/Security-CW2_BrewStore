import React from "react";
import { Link } from "react-router-dom";
import { XCircle, RefreshCw, Home } from "lucide-react";
import bg from "../../assets/cover.jpg";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-coffee-bean font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bg} alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-bean via-transparent to-coffee-bean/50"></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl m-4 border-t-4 border-red-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <XCircle className="text-red-500 w-10 h-10" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-coffee-bean mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We couldn't process your payment. Don't worry, no funds were deducted.
        </p>

        <div className="space-y-4">
          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 w-full bg-coffee-bean text-white py-3.5 rounded-xl font-bold hover:bg-caramel transition-all shadow-lg hover:shadow-caramel/20"
          >
            <RefreshCw size={18} /> Retry Payment
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-100 text-gray-500 py-3.5 rounded-xl font-bold hover:border-coffee-bean hover:text-coffee-bean transition-all"
          >
            <Home size={18} /> Return Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>Please check your payment details or try a different method.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
