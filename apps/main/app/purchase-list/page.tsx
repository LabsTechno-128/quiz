"use client";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/order.service";
import { FiShoppingBag, FiPackage, FiLoader, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function PurchaseListPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMyOrders(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'failed':
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <FiCheckCircle />;
      case 'pending':
        return <FiClock />;
      default:
        return <FiXCircle />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 py-20 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <FiShoppingBag /> My Purchases
          </h1>
          <p className="text-indigo-100 mt-2 text-lg">View and manage your order history.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FiPackage size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">No purchases yet</h2>
            <p className="text-gray-500 mt-3 mb-10 max-w-md mx-auto">It looks like you haven't made any purchases. Explore our products and start your journey today!</p>
            <Link
              href="/"
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-mono font-bold text-gray-700">#{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                      <p className="text-lg font-black text-indigo-600">${order.totalAmount}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 capitalize ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-50">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="p-6 md:p-8 flex items-center gap-6">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.product?.image || "/assets/placeholder.png"}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800 text-lg">{item.product?.title || "Unknown Product"}</h3>
                        <p className="text-gray-400 text-sm">{item.product?.type || "Item"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${item.price}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Info (Optional) */}
                {order.customerAddress && (
                  <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex items-start gap-3">
                    <FiPackage className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivering to</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">{order.customerName}</span> • {order.customerAddress}, {order.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
