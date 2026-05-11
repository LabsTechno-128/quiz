"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4">
            <FiShoppingCart className="text-indigo-600" /> Shopping Cart
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Review your items before checkout.</p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Section - Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
              <p className="text-gray-500 mt-2 mb-8">Add some amazing books to get started.</p>
              <Link
                href="/"
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="relative w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/assets/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm capitalize mb-4">{item.type}</p>
                  <div className="text-2xl font-black text-indigo-600">${item.price}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Section - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax & Fees</span>
                <span className="font-bold text-gray-900">$0.00</span>
              </div>
              <div className="border-t border-gray-50 pt-6 flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Amount</p>
                  <p className="text-4xl font-black text-indigo-600">${totalAmount}</p>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className={`w-full py-5 rounded-2xl font-bold text-white text-center block transition-all shadow-lg ${cart.length === 0
                  ? "bg-gray-200 cursor-not-allowed pointer-events-none"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                }`}
            >
              Proceed to Checkout
            </Link>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <p className="text-xs text-center text-gray-400">
                Secure payment powered by SSLCommerz. We accept all major cards and mobile banking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
