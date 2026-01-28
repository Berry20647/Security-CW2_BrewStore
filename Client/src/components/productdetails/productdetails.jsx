import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getcoffeeById, getAllcoffees } from "../../api/api";
import { useCart } from "../../context/CartContext";
import { Heart, Truck, ShieldCheck, Leaf, Award, ArrowLeft } from "lucide-react";

const weights = [100, 250, 500, 1000];

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(100);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getcoffeeById(id);
        setProduct(prod);
        const all = await getAllcoffees();
        setAllProducts(all.filter((p) => p._id !== id));
      } catch (err) {
        toast.error("Product not found");
      }
    };
    fetchData();
  }, [id]);

  if (!product) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-latte rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-latte rounded"></div>
      </div>
    </div>
  );

  const totalPrice = Number(((product.pricePerGram || 1) * weight).toFixed(2));
  const imageSrc = product.image
    ? `http://localhost:5001/uploads/${product.image}`
    : "http://localhost:5001/uploads/placeholder.jpg";

  const handleBuyNow = () => {
    addToCart({
      id: product._id,
      title: product.name,
      pricePerGram: product.pricePerGram,
      weight,
      totalPrice,
      image: imageSrc,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  return (
    <div className="bg-cream min-h-screen text-coffee-bean font-sans pb-20">

      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-caramel transition-colors"
        >
          <ArrowLeft size={16} /> Back to Roast Collection
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left: Image */}
        <div className="relative group">
          <div className="absolute inset-0 bg-rich-roast/5 rounded-[2rem] transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-1"></div>
          <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-xl border border-white/20">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-md text-coffee-bean text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                Premium Quality
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-bean leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1 text-yellow-500">
                ★★★★★ <span className="text-gray-400 ml-1">(4.9/5)</span>
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-caramel font-semibold">Single Origin</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-latte/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Weight</label>
                <div className="flex gap-2">
                  {weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${weight === w
                          ? "bg-coffee-bean text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {w === 1000 ? "1kg" : `${w}g`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-rich-roast">Rs {totalPrice.toLocaleString()}</div>
                <div className={`text-sm font-medium ${product.stock > 0 ? "text-muted-olive" : "text-berry"}`}>
                  {product.stock > 0 ? "In Stock & Ready to Ship" : "Currently Unavailable"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  addToCart({
                    id: product._id,
                    title: product.name,
                    pricePerGram: product.pricePerGram,
                    weight,
                    totalPrice,
                    image: imageSrc,
                    stock: product.stock,
                  });
                  toast.success(`${product.name} added to cart!`);
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-coffee-bean text-cream py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-caramel hover:text-white transition-all shadow-lg hover:shadow-caramel/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 border-2 border-coffee-bean text-coffee-bean py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-coffee-bean hover:text-cream transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BUY NOW
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2"><Truck size={14} /> Free Shipping Over Rs 2000</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} /> Secure Checkout</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold text-coffee-bean mb-4">Master Roaster's Note</h3>
            <div className="prose prose-sm text-gray-600 leading-relaxed bg-latte/10 p-6 rounded-2xl border border-latte/20">
              <p>{product.description || "A delicately balanced roast with rich undertones and a smooth finish. Perfect for your morning ritual."}</p>
              {product.bulletPoints?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {product.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-caramel rounded-full flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FeatureCard icon={Leaf} title="Ethical" desc="Direct Trade" />
            <FeatureCard icon={Award} title="Premium" desc="Grade 1 Beans" />
            <FeatureCard icon={Coffee} title="Fresh" desc="Roasted Weekly" />
          </div>

        </div>
      </div>

      {/* Related Section could follow here */}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
      <Icon className="w-6 h-6 mx-auto text-caramel mb-2" />
      <h4 className="font-bold text-coffee-bean text-sm">{title}</h4>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}
