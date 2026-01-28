import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../context/UserContext";
import ResponsiveMenu from "./ResponsiveMenu";

export default function Navbar() {
  const { user, logout, loading } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userDropdownRef = useRef();
  const authDropdownRef = useRef();
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(e.target)
      ) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleNavbarSearch = (e) => {
    e.preventDefault();
    if (navbarSearch.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(navbarSearch.trim())}`);
      setMobileMenuOpen(false);
    } else {
      navigate("/allproducts");
      setMobileMenuOpen(false);
    }
  };

  if (loading) return null;

  return (
    <header className="w-full sticky top-0 z-50 bg-coffee-bean/95 backdrop-blur-sm border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-3xl font-serif font-bold text-cream tracking-wider flex items-center gap-2 group">
          <span className="group-hover:text-caramel transition-colors duration-300">Brew</span>
          <span className="text-caramel group-hover:text-cream transition-colors duration-300">Store</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8 text-latte font-medium text-sm tracking-wide">
          <Link to="/" className="hover:text-caramel transition-colors duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/allproducts" className="hover:text-caramel transition-colors duration-300 relative group">
            Beans
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="hover:text-caramel transition-colors duration-300 relative group">
            Our Roast Story
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="hover:text-caramel transition-colors duration-300 relative group">
            Bean in Touch
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-6">
          {/* SEARCH BAR (Desktop) */}
          <form
            onSubmit={handleNavbarSearch}
            className="hidden md:flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full focus-within:border-caramel/50 focus-within:bg-white/10 transition-all duration-300"
          >
            <input
              type="text"
              placeholder="Search origin..."
              value={navbarSearch}
              onChange={e => setNavbarSearch(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-latte w-48 placeholder:text-white/30"
            />
            <button type="submit" className="text-caramel hover:text-white transition-colors">
              <FaSearch size={14} />
            </button>
          </form>

          {/* CART ICON */}
          {user && (
            <Link to="/cart" className="relative text-latte hover:text-caramel transition-colors" title="Cart">
              <FaShoppingCart size={20} />
            </Link>
          )}

          {/* USER DROPDOWN (Desktop) */}
          {user ? (
            <div className="relative hidden md:block" ref={userDropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-3 text-latte hover:text-caramel transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-caramel/20 flex items-center justify-center text-caramel border border-caramel/50">
                  <FaUserCircle size={20} />
                </div>
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                <FaChevronDown size={10} className={`transform transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2"
                  >
                    <button
                      onClick={() => handleDropdownClick("/my-orders")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-latte/30 hover:text-coffee-bean transition-colors"
                    >
                      <FaClipboardList className="text-caramel" /> Orders
                    </button>
                    <button
                      onClick={() => handleDropdownClick("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-latte/30 hover:text-coffee-bean transition-colors"
                    >
                      <FaUserCircle className="text-caramel" /> Profile
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-4"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex gap-4 items-center">
              <Link to="/login" className="text-latte hover:text-caramel text-sm font-medium transition-colors">Log In</Link>
              <Link to="/register" className="bg-caramel text-coffee-bean px-5 py-2 rounded-full text-sm font-semibold hover:bg-cream hover:text-rich-roast transition-all shadow-lg hover:shadow-caramel/20">
                Get Started
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="lg:hidden text-latte hover:text-caramel transition p-1 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR (Visible only on mobile below navbar when menu is open or always?) 
          Let's put it inside the ResponsiveMenu for cleaner UI, or just below header
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-coffee-bean border-t border-white/5 px-4 pb-4"
          >
            <form
              onSubmit={handleNavbarSearch}
              className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-lg mb-4 mt-2"
            >
              <input
                type="text"
                placeholder="Search beans..."
                value={navbarSearch}
                onChange={e => setNavbarSearch(e.target.value)}
                className="bg-transparent focus:outline-none text-sm text-latte w-full placeholder:text-white/30"
              />
              <button type="submit" className="text-caramel">
                <FaSearch size={14} />
              </button>
            </form>
            <ResponsiveMenu isOpen={true} user={user} logout={handleLogout} closeMenu={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
