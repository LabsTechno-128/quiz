"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../../contexts/CartContext";
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiArrowRight, FiDownload } from "react-icons/fi";
import Link from "next/link";

function PaymentResult() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "paid") {
      clearCart();
    }
  }, [status, clearCart]);

  const renderContent = () => {
    switch (status) {
      case "paid":
        return (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6 text-green-500">
              <FiCheckCircle size={80} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your order has been confirmed and your digital assets are now available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/purchase-list"
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                View My Ebooks <FiDownload />
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        );
      case "failed":
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6 text-red-500">
              <FiXCircle size={80} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-gray-600 text-lg mb-8">
              We couldn't process your payment. Please try again or use a different payment method.
            </p>
            <Link
              href="/checkout"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              Try Again <FiArrowRight />
            </Link>
          </div>
        );
      case "cancelled":
        return (
          <div className="text-center">
            <div className="flex justify-center mb-6 text-yellow-500">
              <FiAlertCircle size={80} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-gray-600 text-lg mb-8">
              The payment process was cancelled. You can resume it anytime from your cart.
            </p>
            <Link
              href="/cart"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              Return to Cart <FiArrowRight />
            </Link>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Processing...</h1>
            <p className="text-gray-600 text-lg mb-8">We are verifying your transaction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full">
        {renderContent()}
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentResult />
    </Suspense>
  );
}
