import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../api/api";
import toast from "react-hot-toast";
import Payment from "../Payment/Payment";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";
import { Trash2, Plus, Minus, MapPin, Phone, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateWeight,
  } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const esewaFormRef = useRef(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setAddress(data.address || "");
        setPhone(data.phone || "");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch profile info");
      });
  }, []);

  const weightOptions = [100, 250, 500, 1000];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0) * Number(item.quantity || 1),
    0
  );
  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="bg-cream min-h-screen text-coffee-bean font-sans pb-20">
      {/* Header */}
      <div className="bg-coffee-bean py-12 px-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/coffee.png')] opacity-10"></div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-cream relative z-10">Your Coffee Bag</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-latte/20">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-coffee-bean mb-2">Each cup starts with a bean.</h2>
            <p className="text-gray-500 mb-6">Your bag is currently empty.</p>
            <button
              onClick={() => navigate("/allproducts")}
              className="bg-caramel text-coffee-bean font-bold py-3 px-8 rounded-full hover:bg-coffee-bean hover:text-caramel transition-all shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id + "-" + item.weight}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left space-y-2 w-full">
                    <h3 className="text-lg font-serif font-bold text-coffee-bean">{item.title}</h3>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      <select
                        value={item.weight}
                        onChange={(e) =>
                          updateWeight(item.id, item.weight, Number(e.target.value))
                        }
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-caramel"
                      >
                        {weightOptions.map((w) => (
                          <option key={w} value={w}>{w === 1000 ? "1kg" : `${w}g`}</option>
                        ))}
                      </select>

                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.weight, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-500 hover:text-coffee-bean"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-coffee-bean"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-center sm:items-end gap-2">
                    <span className="text-lg font-bold text-rich-roast">
                      Rs {(Number(item.totalPrice || 0) * Number(item.quantity || 1)).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id, item.weight)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-latte/30 sticky top-24">
                <h2 className="text-xl font-serif font-bold text-coffee-bean mb-6 pb-4 border-b border-gray-100">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} /> Shipping Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter delivery address"
                      className="input-field w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Phone size={12} /> Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      className="input-field w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">Rs {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-coffee-bean pt-3 border-t border-gray-100 mt-2">
                    <span>Total</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Payment Method</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {["cod", "khalti", "esewa"].map((method) => (
                      <label key={method} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === method ? "bg-latte/20 border-caramel shadow-sm" : "bg-gray-50 border-transparent hover:bg-gray-100"
                        }`}>
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-caramel focus:ring-caramel"
                        />
                        <span className="text-sm font-medium">
                          {method === "cod" && "Cash on Delivery"}
                          {method === "khalti" && "Khalti Digital Wallet"}
                          {method === "esewa" && "eSewa Mobile Wallet"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4 text-center">{error}</div>}

                {/* Payment Actions */}
                {paymentMethod !== "esewa" && (
                  <Payment
                    cart={cartItems}
                    address={address}
                    contact={phone}
                    paymentMethod={paymentMethod}
                    total={total}
                    setError={setError}
                    setLoading={setLoading}
                    onSuccess={handlePaymentSuccess}
                  />
                )}

                {paymentMethod === "esewa" && cartItems.length > 0 && (() => {
                  const transaction_uuid = uuidv4();
                  const { signedFieldNames, signature } = generateEsewaSignature({
                    total_amount: total,
                    transaction_uuid,
                    product_code: "EPAYTEST",
                  });

                  return (
                    <form
                      ref={esewaFormRef}
                      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                      method="POST"
                    >
                      <input type="hidden" name="amount" value={subtotal} />
                      <input type="hidden" name="tax_amount" value="0" />
                      <input type="hidden" name="total_amount" value={total} />
                      <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
                      <input type="hidden" name="product_code" value="EPAYTEST" />
                      <input type="hidden" name="product_service_charge" value="0" />
                      <input type="hidden" name="product_delivery_charge" value={shipping} />
                      <input type="hidden" name="success_url" value="http://localhost:5174/paymentsuccess" />
                      <input type="hidden" name="failure_url" value="http://localhost:5174/paymentfailure" />
                      <input type="hidden" name="signed_field_names" value={signedFieldNames} />
                      <input type="hidden" name="signature" value={signature} />

                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        Pay with eSewa <ArrowRight size={18} />
                      </button>
                    </form>
                  );
                })()}

                <div className="text-center mt-4">
                  <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-caramel underline">Continue Shopping</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-coffee-bean/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full mx-auto transform animate-bounce-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-coffee-bean mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 mb-6">Your fresh roast is being prepared.</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-caramel animate-loading-bar w-full"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Redirecting home...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
