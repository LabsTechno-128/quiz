"use client";
import { privateRequest } from "../../config/axios.config";
import { useState, useEffect } from "react";
import { Toastify } from "../../components/ui/toastify";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Tag,
  Layers,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Banner = {
  id: string;
  name: string;
  subName: string;
  image: string;
  description: string;
  status: boolean;
  category: { id: string, name: string } | null;
  products: any[];
  createdAt: string;
  updatedAt: string;
};

export default function BannerPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchBanners = async (page = 1) => {
    setLoading(true);
    try {
      const limit = viewMode === "grid" ? 9 : 10;
      const url = `/banners?page=${page}&limit=${limit}&search=${searchTerm}`;

      const response = await privateRequest.get(url);
      const data = response.data;

      // The backend returns { result: data, total, page, limit, totalPages, ... }
      setBanners(data.result || []);
      setPagination({
        page: data.page || page,
        limit: data.limit || limit,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      });
    } catch (error) {
      console.error("Error fetching banners:", error);
      Toastify.Error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBanners(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, viewMode]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await privateRequest.delete(`/banners/${id}`);
        Toastify.Success("Banner deleted successfully");
        fetchBanners(pagination.page);
      } catch (error) {
        Toastify.Error("Failed to delete banner");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Campaign Banners
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your promotional campaigns and link them to categories or products.
          </p>
        </div>
        <Link
          href="/banner/create"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 rounded-[1.5rem] text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 group"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Create Banner
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 overflow-visible">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center p-1.5 bg-white border border-slate-100 rounded-[1.75rem] shadow-sm shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-2xl transition-all ${viewMode === "grid" ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-2xl transition-all ${viewMode === "table" ? "bg-slate-100 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search banner name..."
            className="w-full pl-12 pr-6 py-3.5 rounded-[1.5rem] bg-white border border-slate-100 text-sm focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all outline-none shadow-sm placeholder:text-slate-300 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content View */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-[2.5rem] border border-slate-100 border-dashed">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
          <p className="text-sm font-bold text-slate-400 animate-pulse">
            Fetching banners...
          </p>
        </div>
      ) : banners.length === 0 ? (
        <div className="py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed flex flex-col items-center justify-center text-center px-10">
          <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-8 border border-slate-100 shadow-inner">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            No banners found
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md font-medium leading-relaxed">
            Start by creating a new banner to promote your products.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col relative scale-[0.99] hover:scale-100"
            >
              {/* Banner Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={banner.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800"}
                  alt={banner.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute top-6 left-6">
                  <span
                    className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/20 ${banner.status ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}
                  >
                    {banner.status ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <button
                    onClick={() => router.push(`/banner/create?id=${banner.id}`)}
                    className="p-3.5 bg-white text-indigo-600 rounded-[1.25rem] shadow-2xl hover:bg-slate-50 transition-all font-bold"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-3.5 bg-white text-red-600 rounded-[1.25rem] shadow-2xl hover:bg-slate-50 transition-all font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Banner Content */}
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  {banner.category && (
                    <div className="px-4 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border border-indigo-100/50">
                      <Layers className="h-3 w-3" />
                      {banner.category.name}
                    </div>
                  )}
                  <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border border-slate-100">
                    <ShoppingBag className="h-3 w-3" />
                    {banner.products?.length || 0} Products
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                  {banner.name}
                </h3>
                <p className="text-sm text-indigo-600 font-bold mb-4">
                  {banner.subName}
                </p>
                <p className="text-sm text-slate-400 font-medium mb-8 line-clamp-2 leading-relaxed">
                  {banner.description || "No description provided for this campaign."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Banner & Info
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Category
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Status
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Products
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[1.25rem] overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                          <img
                            src={banner.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                            {banner.name}
                          </p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            {banner.subName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-sm text-slate-600">
                      {banner.category ? (
                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                          {banner.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-300">None</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${banner.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {banner.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-slate-300" />
                        <span className="text-sm font-bold text-slate-700">
                          {banner.products?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => router.push(`/banner/create?id=${banner.id}`)}
                          className="p-3 bg-white border border-slate-100 text-indigo-500 rounded-2xl shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-3 bg-white border border-slate-100 text-red-500 rounded-2xl shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && banners.length > 0 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-white px-12 py-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 gap-6">
          <p className="text-sm font-black text-slate-400">
            Page <span className="text-slate-900">{pagination.page}</span> / {pagination.totalPages}
          </p>
          <div className="flex items-center gap-4">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchBanners(pagination.page - 1)}
              className="px-8 py-4 rounded-[1.75rem] border border-slate-100 text-slate-500 font-extrabold text-xs uppercase hover:bg-slate-50 disabled:opacity-20 transition-all flex items-center gap-3"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchBanners(pagination.page + 1)}
              className="px-10 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-2xl"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
