"use client"
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../../contexts/CartContext";
import { FiCheckCircle, FiArrowRight, FiHome } from "react-icons/fi";
import Link from "next/link";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6 py-20">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
            <FiCheckCircle size={56} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-500 text-lg mb-6 max-w-md mx-auto leading-relaxed">
          Your order has been confirmed. Thank you for shopping with us!
        </p>

        {tranId && (
          <div className="mb-10 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 inline-block">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Transaction Reference</span>
            <span className="text-sm font-mono font-bold text-slate-700">{tranId}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/purchase-list"
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
          >
            View My Orders <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/"
            className="bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-2"
          >
            <FiHome /> Continue Shopping
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400 font-medium">
          A confirmation email has been sent to your registered address.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
