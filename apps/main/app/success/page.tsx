"use client";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";


export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center  bg-white text-center px-6 py-10">
      {/* Success Icon */}
      <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
        <FaCheckCircle className="w-12 h-12 text-purple-600" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Your Payment is Successfull
      </h2>

      {/* Description */}
      <p className="text-gray-500 text-sm max-w-md mb-8">
        Your payment will be processed in 30 minutes. If any problem occurs,
        please chat with customer service. Detailed information will include below.
      </p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <Link href="/">
          <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
            Back to home
          </button>
        </Link>
        <Link href="/order-details">
          <button className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition">
            Check Detail
          </button>
        </Link>
      </div>
    </div>
  );
}
