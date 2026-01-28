import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../../assets/hero.jpg";
import hero2 from "../../assets/move1.png";
import hero3 from "../../assets/move2.jpg";
import { motion } from "framer-motion";

const images = [hero1, hero2, hero3];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Image Layer */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-all duration-[2000ms] ease-in-out ${idx === activeIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
        >
          <img
            src={img}
            alt={`brewstore Hero ${idx}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-bean/70 via-coffee-bean/40 to-coffee-bean/90" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wide text-cream drop-shadow-2xl mb-6">
            Elevate Your <span className="text-caramel italic">Ritual</span>
          </h1>
          <p className="text-latte text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
            Sourced with conscience. Roasted with passion. Discover the symphony of flavors in every ethically sourced bean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/allproducts")}
              className="px-8 py-4 bg-caramel text-coffee-bean font-semibold text-lg rounded-full hover:bg-cream hover:text-rich-roast transition-all duration-300 shadow-xl hover:shadow-caramel/20 transform hover:-translate-y-1"
            >
              Shop Our Roasts
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 border-2 border-latte text-latte font-semibold text-lg rounded-full hover:bg-latte hover:text-coffee-bean transition-all duration-300"
            >
              Our Story
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/50 animate-bounce"
      >
        <span className="text-sm tracking-widest uppercase">Scroll to Brew</span>
      </motion.div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 right-10 flex gap-3 z-30">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${i === activeIndex ? "bg-caramel w-8" : "bg-white/30 hover:bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
