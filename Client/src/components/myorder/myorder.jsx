import React, { useState, useEffect } from "react";
import { getUserBookings } from "../../api/api";
import { Package, Clock, XCircle, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    getUserBookings()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      });
  }, []);

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    setCancelReason("");
  };

  const confirmCancel = () => {
    setOrders((prev) => prev.filter((order) => order._id !== selectedOrderId)); // Optimistic UI update
    setCancelModal(false);
    // Logic to call API cancel would go here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "shipped": return "text-blue-600 bg-blue-100";
      case "delivered": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={14} />;
      case "shipped": return <Truck size={14} />;
      case "delivered": return <CheckCircle size={14} />;
      case "cancelled": return <XCircle size={14} />;
      default: return <Package size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-coffee-bean mb-8">My Orders</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caramel mb-4"></div>
            <p>Fetching your brew history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-coffee-bean mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't started your coffee journey with us.</p>
            <a href="/allproducts" className="text-caramel font-bold hover:underline">Start Shopping</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const img = order.coffee?.image
                ? `http://localhost:5001/uploads/${order.coffee.image}`
                : "http://localhost:5001/uploads/placeholder.jpg";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 grid md:grid-cols-[100px_1fr_auto] gap-6 items-center">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={img} alt={order.coffee?.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                        <span className="text-xs text-gray-400">#{order._id.slice(-8)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-coffee-bean mb-1">{order.coffee?.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {order.weight}g x {order.quantity} • Rs {order.totalPrice.toLocaleString()}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1">
                          <Truck size={12} /> {order.address}
                        </div>
                        <div>
                          Ordered on: {new Date().toLocaleDateString()} {/* Date typically comes from DB, placeholder for now */}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 items-end">
                      <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-coffee-bean text-sm font-semibold rounded-lg transition-colors w-full md:w-auto">
                        View Details
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => openCancelModal(order._id)}
                          className="px-4 py-2 border border-red-100 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors w-full md:w-auto"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-coffee-bean/50 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4 text-berry">
              <AlertCircle />
              <h2 className="text-lg font-bold text-coffee-bean">Cancel Order</h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Reason for cancellation</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-coffee-bean text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-caramel mb-6"
            >
              <option value="">Select a reason...</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Shipping time too long">Shipping time too long</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason}
                className="flex-1 py-2.5 rounded-lg bg-berry text-white font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
