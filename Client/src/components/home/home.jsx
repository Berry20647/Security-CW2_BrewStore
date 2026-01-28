// Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Coffee } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import Hero from "../Hero/Hero";
import { getAllcoffees } from "../../api/api";
import brewing from "../../assets/cover.jpg";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllcoffees()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-caramel border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-cream text-coffee-bean font-sans">
      <Hero />

      <div className="bg-white relative z-10 -mt-8 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pt-12">
        <AnimatedProductRow title="Freshly Roasted Picks" products={products.slice(0, 4)} />
      </div>

      <AnimatedProductRow title="Barista Favorites" products={products.slice(4, 8)} darkBg />
      <BrewingGuide />
      <Testimonial />
    </div>
  );
}

function AnimatedProductRow({ title, products, darkBg = false }) {
  const navigate = useNavigate();

  return (
    <section className={`px-4 sm:px-6 md:px-16 lg:px-24 py-20 ${darkBg ? "bg-latte/30" : "bg-white"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-coffee-bean mb-2">{title}</h2>
          <p className="text-gray-500 font-light">Curated selections for the discerning palate.</p>
        </div>
        <button
          onClick={() => navigate("/allproducts")}
          className="group flex items-center gap-2 text-sm font-semibold text-caramel hover:text-rich-roast transition-colors uppercase tracking-widest"
        >
          View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(100);

  const imgSrc = product.image
    ? `http://localhost:5001/uploads/${product.image}`
    : "http://localhost:5001/uploads/placeholder.jpg";

  const price = Math.round(product.pricePerGram * weight);
  // Replaced originalPrice calculation logic with just a visual indicator if needed, 
  // keeping logic same but just displaying.

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer border border-transparent hover:border-latte/50 flex flex-col h-full"
    >
      <div className="h-64 overflow-hidden relative bg-gray-50">
        <img
          src={imgSrc}
          alt={product.name}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Placeholder Roast Badge - logic would go here if data existed */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-coffee-bean text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-gray-100 shadow-sm">
          Premium Roast
        </span>
      </div>

      <div className="p-6 flex flex-col justify-between gap-4 flex-grow">
        <div>
          <h3 className="text-lg font-serif font-bold text-coffee-bean group-hover:text-caramel transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Single Origin</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-rich-roast">Rs {price.toLocaleString()}</span>
          {/* Optional: Add per gram price indicator */}
          <span className="text-xs text-gray-400 font-light">/ {weight}g</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <select
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-50 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-2 py-2 focus:outline-none hover:border-caramel transition-colors"
          >
            <option value={100}>100g Bag</option>
            <option value={250}>250g Bag</option>
            <option value={500}>500g Bag</option>
            <option value={1000}>1kg Bag</option>
          </select>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product._id,
                title: `${product.name} ${weight}g`,
                price,
                image: imgSrc,
                stock: product.stock,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className="bg-coffee-bean text-cream text-xs font-bold px-4 py-2 rounded-full hover:bg-caramel hover:text-white transition-all shadow-md group-hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function BrewingGuide() {
  return (
    <section className="bg-coffee-bean text-white px-6 md:px-20 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-rich-roast/10 rounded-l-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <span className="text-caramel font-bold text-sm uppercase tracking-[0.2em] mb-2 block">Master Class</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
            The Art of the <br /><span className="text-caramel italic">Perfect Brew</span>
          </h2>
          <div className="space-y-6">
            {[
              { title: "Water Quality", desc: "Use filtered water at 90–96°C for optimal extraction." },
              { title: "Fresh Grind", desc: "Grind beans just before brewing to preserve volatile oils." },
              { title: "The Ratio", desc: "We recommend 1g of coffee for every 16g of water." },
              { title: "The Bloom", desc: "Let grounds bloom for 30s to release CO2 before the full pour." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-caramel flex-shrink-0 font-serif font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 border-2 border-caramel/20 rounded-[2rem] transform translate-x-4 translate-y-4"></div>
          <img
            src={brewing}
            alt="Brewing Method"
            className="rounded-[2rem] w-full h-auto object-cover shadow-2xl relative z-10 grayscale-[30%] hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </section>
  );
}

// Moved reviews outside to keep it stable for useEffect
const reviews = [
  { text: "The richness of the Espresso Blend is unmatched. My mornings have been transformed.", name: "Sujal Lama", role: "Coffee Enthusiast" },
  { text: "Finally, a roaster that understands the nuance of a light roast. Pure perfection.", name: "Ritika Rai", role: "Home Barista" },
  { text: "Fast shipping and incredible packaging. The beans arrived fresher than I thought possible.", name: "Kabir Karki", role: "Verified Buyer" },
];

function Testimonial() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-cream py-24 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <Coffee className="mx-auto text-caramel mb-6 w-10 h-10" />
        <h2 className="text-sm font-bold text-muted-olive uppercase tracking-widest mb-10">What Our Community Says</h2>

        <div className="relative h-48 sm:h-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="text-2xl md:text-3xl font-serif text-coffee-bean leading-relaxed italic mb-6">
                “{reviews[index].text}”
              </p>
              <div>
                <p className="text-base font-bold text-rich-roast">{reviews[index].name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{reviews[index].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-caramel w-6" : "bg-gray-300 hover:bg-caramel/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
