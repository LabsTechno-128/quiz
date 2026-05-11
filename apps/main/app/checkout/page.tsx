"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { paymentService } from "../../services/payment.service";
import { useRouter } from "next/navigation";
import { FiLoader, FiShoppingCart, FiCreditCard } from "react-icons/fi";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login"); // or show login modal
      return;
    }

    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const items = cart.map((item) => ({ id: item.id, quantity: item.quantity }));
      const response = await paymentService.initPayment(items);

      if (response?.url) {
        // Optional: clear cart before redirecting or after success? 
        // Better after success, but if user cancels they might want their cart back.
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) return <div className="flex justify-center py-20"><FiLoader className="animate-spin text-3xl" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 py-16 px-6 lg:px-24">
        <h1 className="text-4xl font-bold text-white">Checkout</h1>
        <p className="text-indigo-100 mt-2">Secure your purchase with SSLCommerz</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiShoppingCart /> Your Cart
              </h2>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                {cart.length} Items
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {cart.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  Your cart is empty. <br />
                  <button onClick={() => router.push('/')} className="text-indigo-600 font-semibold mt-2">Go Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-6">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/assets/placeholder.png"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                      <p className="text-gray-500 text-sm capitalize">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">${item.price * item.quantity}</p>
                      <p className="text-gray-400 text-sm">{item.quantity} x ${item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Details</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-50 pt-4 flex justify-between text-xl font-black text-gray-900">
                <span>Total</span>
                <span>${totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isProcessing || cart.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                }`}
            >
              {isProcessing ? (
                <>
                  <FiLoader className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FiCreditCard /> Pay with SSLCommerz
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-6">
              By clicking checkout, you agree to our Terms and Conditions.
              Payments are processed securely via SSLCommerz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
