"use client";
import { privateRequest } from "@/app/config/axios.config";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Package,
  Calendar,
  MoreHorizontal,
  Loader2,
  X,
  User,
  Tag,
  DollarSign,
  Box,
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDeleteConfirm } from "@/app/context/DeleteModalProvider";
import Image from "next/image";
import StatusBadge from "@/app/components/ui/badge";

export default function ProductPage() {
  const deleteConfirm = useDeleteConfirm();
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await privateRequest.get("/products");
      setProducts(response.data?.result || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      Toastify.Error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    deleteConfirm(async () => {
      try {
        await privateRequest.delete(`/products/${id}`);
        setProducts(products.filter((p: any) => p.id !== id));
        Toastify.Success("Product deleted successfully");
      } catch (error) {
        Toastify.Error("Failed to delete product");
      }
    });
  };

  const filteredProducts =
    (products.length > 0 &&
      products?.filter(
        (p: any) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.author?.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
    [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            Product Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage your inventory, prices, and stock levels.
          </p>
        </div>
        <Link
          href="/product/create"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-medium">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              Loading products...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Product Info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Category & Type
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product: any) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100 flex-shrink-0 overflow-hidden`}
                        >
                          {product?.image ? (
                            <Image
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <Package className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <User className="h-3 w-3" /> {product.author || "Unknown Author"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {product.type}
                        </span>
                        <p className="text-xs text-slate-500 font-medium">
                          {product.category?.name || "Uncategorized"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-indigo-600">
                          ${product.sellPrice}
                        </span>
                        {product.offerPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${product.sellPrice}
                          </span>
                        )}
                        {product.offerPrice && (
                          <span className="text-[10px] font-bold text-emerald-500">
                            ${product.offerPrice} (Offer)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={product.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/create?id=${product.id}`}
                          className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-red-600 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4 " />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
