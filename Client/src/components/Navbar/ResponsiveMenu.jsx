import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaClipboardList, FaCoffee, FaInfoCircle, FaEnvelope } from "react-icons/fa";

const ResponsiveMenu = ({ isOpen, user, logout, closeMenu }) => {
  if (!isOpen) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
        >
          <FaCoffee className="text-caramel" /> Home
        </Link>
        <Link
          to="/allproducts"
          onClick={closeMenu}
          className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
        >
          <FaClipboardList className="text-caramel" /> Beans
        </Link>
        <Link
          to="/about"
          onClick={closeMenu}
          className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
        >
          <FaInfoCircle className="text-caramel" /> Our Story
        </Link>
        <Link
          to="/contact"
          onClick={closeMenu}
          className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
        >
          <FaEnvelope className="text-caramel" /> Contact
        </Link>
      </nav>

      <div className="h-px bg-white/10 my-1"></div>

      {/* User Actions */}
      {user ? (
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 text-xs uppercase text-white/40 tracking-wider font-semibold">
            Account ({user.name})
          </div>
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
          >
            <FaUserCircle className="text-caramel" /> Profile
          </Link>
          <Link
            to="/my-orders"
            onClick={closeMenu}
            className="flex items-center gap-3 text-latte hover:text-caramel p-3 rounded-lg hover:bg-white/5 transition-all"
          >
            <FaClipboardList className="text-caramel" /> Orders
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-red-500/10 transition-all text-left w-full"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-2">
          <Link
            to="/login"
            onClick={closeMenu}
            className="text-center w-full py-3 rounded-lg border border-caramel text-caramel hover:bg-caramel hover:text-coffee-bean font-semibold transition-all"
          >
            Log In
          </Link>
          <Link
            to="/register"
            onClick={closeMenu}
            className="text-center w-full py-3 rounded-lg bg-caramel text-coffee-bean hover:bg-white font-semibold shadow-lg hover:shadow-caramel/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResponsiveMenu;
