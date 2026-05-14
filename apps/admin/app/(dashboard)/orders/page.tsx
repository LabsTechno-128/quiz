"use client";

import { useState, useEffect } from "react";
import { privateRequest } from "@/app/config/axios.config";
import {
  ShoppingCart,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  User,
  Package,
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const response = await privateRequest.get("/orders/all");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Toastify.Error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await privateRequest.patch(`/orders/${id}/status`, { status });
      if (response.data) {
        setOrders(orders.map((o: any) => (o.id === id ? response.data : o)));
        Toastify.Success(`Order status updated to ${status}`);
        if (selectedOrder?.id === id) {
          setSelectedOrder(response.data);
        }
      }
    } catch (error) {
      Toastify.Error("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(
    (order: any) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'failed':
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor transactions, update statuses, and manage customer deliveries.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Orders</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {orders.filter((o: any) => o.status === 'paid').length}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase">Paid Orders</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {orders.filter((o: any) => o.status === 'pending').length}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              ${orders.reduce((acc: number, o: any) => acc + (o.status === 'paid' ? Number(o.totalAmount) : 0), 0).toFixed(2)}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 text-center text-slate-400 font-medium">Loading orders...</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.map((order: any) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedOrder?.id === order.id ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-bold text-slate-900">#{order.id.split('-')[0].toUpperCase()}</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">${order.totalAmount}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{order.customerName}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10} /> {order.customerPhone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 rounded-xl text-slate-300 hover:bg-white hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100 shadow-sm">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden sticky top-8 animate-in slide-in-from-right duration-300">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
                    <p className="text-sm text-slate-500 mt-1">Transaction ID: <span className="font-mono text-xs">{selectedOrder.id}</span></p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-white transition-all">
                    <XCircle className="h-5 w-5 text-slate-300" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                      <p className="text-sm font-bold">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shipping Address</p>
                      <p className="text-sm font-bold">{selectedOrder.customerAddress}, {selectedOrder.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} /> Order Items
                </h3>
                <div className="space-y-4 mb-8">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-50">
                      <img src={item.product?.image || "/placeholder.png"} className="h-12 w-12 rounded-xl object-cover bg-slate-100" />
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.product?.title}</p>
                        <p className="text-xs text-slate-400">{item.quantity} x ${item.price}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase">Total Amount</span>
                    <span className="text-2xl font-black text-indigo-600">${selectedOrder.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Order Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'paid')}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedOrder.status === 'paid' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                    >
                      Mark as Paid
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedOrder.status === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-100 hover:bg-amber-50'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedOrder.status === 'cancelled' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'failed')}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedOrder.status === 'failed' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                    >
                      Failed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-slate-200" />
              </div>
              <p className="font-bold text-slate-400">Select an order to view details</p>
              <p className="text-xs max-w-[200px] mt-1">Full customer info and item lists will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
