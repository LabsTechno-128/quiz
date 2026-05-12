
"use client"
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiXCircle, FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

function FailedContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6 py-20">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-2xl w-full text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
            <FiXCircle size={56} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Failed</h1>
        <p className="text-slate-500 text-lg mb-6 max-w-md mx-auto leading-relaxed">
          We encountered an issue while processing your transaction. No funds were deducted from your account.
        </p>

        {tranId && (
          <div className="mb-10 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 inline-block">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">Transaction Reference</span>
            <span className="text-sm font-mono font-bold text-slate-700">{tranId}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/checkout"
            className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2 group"
          >
            Try Again <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
          </Link>
          <Link
            href="/"
            className="bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-2"
          >
            <FiHome /> Back to Home
          </Link>
        </div>

        <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-500">
            If you continue to experience issues, please contact our support team with your order details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
