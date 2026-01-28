import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import beans from "../../assets/loogoo.png"; // Keeping the original image import

export default function Footer() {
  return (
    <footer className="bg-coffee-bean text-latte pt-20 pb-10 relative overflow-hidden border-t-8 border-rich-roast">
      {/* Decorative patterns or overlays could go here */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rich-roast via-caramel to-rich-roast opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-cream tracking-wide">
              Brew<span className="text-caramel">Store</span>
            </h2>
            <p className="text-sm text-latte/80 leading-relaxed max-w-xs">
              Crafting moments of clarity, one cup at a time. We source the finest beans from ethical growers to bring you the perfect roast.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebookF, FaTwitter, FaYoutube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-rich-roast flex items-center justify-center text-caramel hover:bg-caramel hover:text-coffee-bean transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-caramel font-serif font-semibold text-lg mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/allproducts" className="hover:text-caramel transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-caramel rounded-full"></span> All Beans</Link></li>
              <li><Link to="/" className="hover:text-caramel transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-caramel rounded-full"></span> Home</Link></li>
              <li><Link to="/about" className="hover:text-caramel transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-caramel rounded-full"></span> Our Story</Link></li>
              <li><Link to="/cart" className="hover:text-caramel transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-caramel rounded-full"></span> Your Cart</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-caramel font-serif font-semibold text-lg mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-caramel mt-1" />
                <span className="text-latte/80">123 Roasted Ave, Coffee District,<br />Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-caramel" />
                <span className="text-latte/80">+977 9800000000</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-caramel" />
                <span className="text-latte/80">hello@brewstore.com</span>
              </li>
            </ul>
          </div>

          {/* Brew Tip / Newsletter */}
          <div className="bg-rich-roast/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-caramel font-serif font-semibold text-lg mb-4 tracking-wide">Daily Brew Tip</h3>
            <p className="text-sm text-latte/80 italic mb-4">
              "For a perfect pour-over, bloom your grounds for 30 seconds before a slow spiral pour."
            </p>
            <div className="text-xs text-caramel font-medium text-right">— Head Roaster</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-latte/60">
          <p>© {new Date().getFullYear()} brewstore. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-caramel transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-caramel transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
