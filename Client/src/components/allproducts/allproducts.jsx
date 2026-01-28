// AllProducts.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Coffee } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllcoffees } from "../../api/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();
  const search = query.get("search") || "";
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    setLoading(true);
    getAllcoffees()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.name)))];
  const categoryFiltered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.name === selectedCategory);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return categoryFiltered;
    const term = debouncedSearch.trim().toLowerCase();
    return categoryFiltered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.toLowerCase().includes(term))
    );
  }, [categoryFiltered, debouncedSearch]);

  return (
    <div className="bg-cream text-coffee-bean min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Section */}
      <div className="bg-coffee-bean text-cream py-16 px-6 md:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our <span className="text-caramel italic">Roast</span> Collection
          </h1>
          <p className="text-latte/80 text-lg font-light">
            Explore our ethically sourced, artisanal blends. From light floral notes to deep, bold roasts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 border ${selectedCategory === cat
                    ? "bg-coffee-bean text-caramel border-coffee-bean shadow-lg"
                    : "bg-white border-latte text-coffee-bean hover:bg-latte/20 hover:border-caramel"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search beans..."
              defaultValue={search}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-latte rounded-full text-coffee-bean focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-32 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-caramel mb-4"></div>
            <p className="text-coffee-bean font-serif text-lg">Brewing your selection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-berry font-medium bg-berry/10 rounded-2xl border border-berry/20 max-w-lg mx-auto">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Coffee size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg">No brews found matching your taste.</p>
            <button onClick={() => setSelectedCategory("All")} className="mt-4 text-caramel hover:underline">View all beans</button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { _id, name, pricePerGram, stock, image } = product;
  const [weight, setWeight] = useState(100);

  const imgSrc = image
    ? `http://localhost:5001/uploads/${image}`
    : "http://localhost:5001/uploads/placeholder.jpg";

  const price = Math.round(pricePerGram * weight);
  // const originalPrice = Math.round(price * 1.05); // Optional: if needed

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      title: `${name} ${weight}g`,
      price,
      image: imgSrc,
      stock,
    });
    toast.success(`${name} (${weight}g) added to cart!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-coffee-bean/10 transition-all duration-500 cursor-pointer border border-transparent hover:border-latte/30 flex flex-col h-full"
    >
      <div className="h-64 overflow-hidden relative bg-gray-50">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Placeholder Roast Badge - logic needed dynamically if real data exists */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="bg-white/95 backdrop-blur-sm text-coffee-bean text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-gray-100 uppercase tracking-wider">
            Premium
          </span>
          {stock === 0 && (
            <span className="bg-berry text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between gap-4 flex-grow">
        <div>
          <h3 className="text-lg font-serif font-bold text-coffee-bean group-hover:text-caramel transition-colors line-clamp-2 leading-tight">
            {name}
          </h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Single Origin</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Starting at</span>
            <span className="text-lg font-bold text-rich-roast">Rs {price.toLocaleString()}</span>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <select
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="appearance-none bg-latte/10 text-coffee-bean text-xs font-semibold border border-latte rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-caramel cursor-pointer hover:bg-latte/20 transition-colors"
            >
              <option value={100}>100g</option>
              <option value={250}>250g</option>
              <option value={500}>500g</option>
              <option value={1000}>1kg</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-coffee-bean text-cream hover:bg-caramel hover:text-white hover:shadow-lg transform active:scale-95"
            }`}
        >
          {stock === 0 ? "Out of Stock" : (
            <>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
