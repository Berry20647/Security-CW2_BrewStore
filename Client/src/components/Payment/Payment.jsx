import { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../api/api";
import toast from "react-hot-toast";
import { verifyFormDataIntegrity, verifyAPIResponseIntegrity } from '../../utils/integrityUtils';
import { ArrowRight, CreditCard } from "lucide-react";

const publicTestKey = "test_public_key_402c2b0e98364222bb1c1ab02369cefd";

const Payment = ({
  cart,
  address,
  contact,
  paymentMethod,
  total,
  setError,
  setLoading,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(null);

  const config = {
    publicKey: publicTestKey,
    productIdentity: "brewstore-coffees-order",
    productName: "brewstore Order",
    productUrl: "http://localhost:5174",
    eventHandler: {
      onSuccess(payload) {
        handlePaymentSuccess(payload.token);
      },
      onError(error) {
        setError("Payment failed. Please try again.");
        setLoading(false);
      },
      onClose() {
        setLoading(false);
      },
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
  };

  useEffect(() => {
    const khaltiCheckout = new KhaltiCheckout(config);
    setCheckout(khaltiCheckout);
  }, []);

  const handlePaymentSuccess = async (transactionId = null) => {
    try {
      for (const item of cart) {
        const bookingData = {
          coffee: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address: address,
          phone: contact,
          weight: item.weight,
          pricePerGram: item.totalPrice,
          paymentMethod: paymentMethod,
          khaltiTransactionId: transactionId
        };
        await createBooking(bookingData);
      }
      clearCart();
      onSuccess();
      navigate("/success");
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError("Network error: Server unreachable.");
      } else {
        setError(err.message || "Failed to complete order");
      }
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!contact || !address) {
      toast.error("Please fill in shipping details first.");
      return;
    }

    const paymentData = { contact, address, cart, paymentMethod, total };
    if (!verifyFormDataIntegrity(paymentData, 'payment')) {
      toast.error("Invalid payment data detected.");
      return;
    }

    if (cart.length === 0) return;
    setLoading(true);

    if (paymentMethod === "khalti") {
      if (checkout) {
        checkout.show({ amount: total * 100 });
      } else {
        setError("Payment system initializing...");
        setLoading(false);
      }
    } else if (paymentMethod === "cod") {
      try {
        for (const item of cart) {
          const bookingData = {
            products: [{ productId: item._id, quantity: item.quantity, price: item.price }],
            totalAmount: item.price * item.quantity,
            shippingAddress: address,
            contact: contact,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending"
          };
          const response = await createBooking(bookingData);
          if (!verifyAPIResponseIntegrity(response)) {
            toast.error("Invalid response from server");
            return;
          }
        }
        toast.success("Order placed successfully!");
        setCart([]); // This might be a typo in original code, usually clearCart()
        navigate("/success");
      } catch (error) {
        toast.error("Failed to place order.");
      }
    }
  };

  const getButtonText = () => {
    if (paymentMethod === "khalti") return "Pay with Khalti";
    if (paymentMethod === "esewa") return null; // Handled by form in parent
    return "Place Order (Cash on Delivery)";
  };

  const text = getButtonText();
  if (!text) return null;

  return (
    <button
      onClick={handleConfirmOrder}
      className={`w-full py-3.5 rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.98] ${paymentMethod === 'khalti'
        ? 'bg-purple-700 hover:bg-purple-800 text-white'
        : 'bg-coffee-bean hover:bg-caramel text-cream hover:text-white'
        }`}
      disabled={cart.length === 0}
    >
      {text} {paymentMethod === 'cod' && <ArrowRight size={18} />} {paymentMethod === 'khalti' && <CreditCard size={18} />}
    </button>
  );
};

export default Payment;