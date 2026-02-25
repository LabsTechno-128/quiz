"use client";
import { privateRequest } from "../../config/axios.config";
import { useState, useEffect } from "react";
import { Toastify } from "../../components/ui/toastify";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Share2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  User,
  Tag,
  Clock,
  LayoutGrid,
  List as ListIcon,
  Globe,
  Layers
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Article = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  slug: string;

}
export default function ArticlePage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Posts");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 0 });

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const limit = viewMode === "grid" ? 9 : 10;
      let url = `/articles?page=${page}&limit=${limit}&search=${searchTerm}`;

      if (activeTab === "Published") url += "&isPublished=true";
      if (activeTab === "Drafts") url += "&isPublished=false";

      const response = await privateRequest.get(url);
      const data = response.data;
      console.log(data.result, data)

      if (Array.isArray(data)) {

        setArticles(data);
        setPagination(prev => ({ ...prev, total: data.length, totalPages: 1, page: 1 }));
      } else {
        console.log(data.data)
        setArticles(data.result || []);
        setPagination({
          page: data.meta?.currentPage || page,
          limit: data.meta?.itemsPerPage || limit,
          total: data.meta?.totalItems || 0,
          totalPages: data.meta?.totalPages || 0
        });
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching articles:", error);
      Toastify.Error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, viewMode]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await privateRequest.delete(`/articles/${id}`);
        Toastify.Success("Article deleted successfully");
        fetchArticles(pagination.page);
      } catch (error) {
        Toastify.Error("Failed to delete article");
      }
    }
  };

  const tabs = ['All Posts', 'Published', 'Drafts'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Blog & Articles</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your editorial content and storytelling with professional precision.</p>
        </div>
        <Link
          href="/article/create"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 rounded-[1.5rem] text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 group"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Create Article
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 overflow-visible">
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <div className="flex items-center p-1.5 bg-white border border-slate-100 rounded-[1.75rem] shadow-sm shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-xs font-bold whitespace-nowrap rounded-[1.25rem] transition-all duration-300 ${activeTab === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>

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
            placeholder="Search title, author, category..."
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
          <p className="text-sm font-bold text-slate-400 animate-pulse">Fetching articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed flex flex-col items-center justify-center text-center px-10">
          <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-8 border border-slate-100 shadow-inner">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">No articles found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md font-medium leading-relaxed">Try adjusting your search terms or filters to find what you&apos;re looking for.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden flex flex-col relative scale-[0.99] hover:scale-100">
              {/* Article Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={article.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute top-6 left-6">
                  <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/20 ${article.isPublished ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
                    {article.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <button
                    onClick={() => router.push(`/article/edit/${article.id}`)}
                    className="p-3.5 bg-white text-indigo-600 rounded-[1.25rem] shadow-2xl hover:bg-slate-50 transition-all font-bold"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-3.5 bg-white text-red-600 rounded-[1.25rem] shadow-2xl hover:bg-slate-50 transition-all font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="px-4 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 border border-indigo-100/50">
                    <Tag className="h-3 w-3" />
                    {article.category || "Uncategorized"}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2 min-h-[56px]">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-8 line-clamp-2 leading-relaxed">
                  {article.subtitle || "Exploring the depths of storytelling with professional insights."}
                </p>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{article.author || "Admin"}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!searchTerm && activeTab === "All Posts" && (
            <Link
              href="/article/create"
              className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-[15deg] transition-all duration-700 mb-8 shadow-inner border border-indigo-100">
                  <Plus className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-400 group-hover:text-slate-900 transition-colors tracking-tight">Draft New Story</h3>
                <p className="text-sm text-slate-400 text-center mt-3 px-8 font-bold leading-relaxed opacity-60 group-hover:opacity-100">Start writing your next masterpiece and engage your readers today.</p>
              </div>
            </Link>
          )}
        </div>
      ) : (
        /* Table View - Inspired by Category Page but more detailed for Articles */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Article & Preview</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[1.25rem] overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm relative group/thumb">
                          <img
                            src={article.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=200"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-125"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px] lg:max-w-[300px]">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="h-3 w-3 text-slate-300" />
                            <code className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">/{article.slug}</code>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold">
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">
                        {article.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${article.isPublished ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                          {article.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-indigo-400" />
                          <p className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{article.author || "Admin"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => router.push(`/article/edit/${article.id}`)}
                          className="p-3 bg-white border border-slate-100 text-indigo-500 rounded-2xl shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all transform hover:scale-110 active:scale-95"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-3 bg-white border border-slate-100 text-red-500 rounded-2xl shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all transform hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
                          <MoreVertical className="h-4 w-4" />
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

      {/* Pagination Container */}
      {!loading && articles.length > 0 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-white px-12 py-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
            <p className="text-sm font-black text-slate-400 tracking-tight">
              Page <span className="text-slate-900 text-base">{pagination.page}</span> <span className="mx-1 font-normal opacity-30">/</span> <span className="text-slate-900 opacity-60 font-bold">{pagination.totalPages || 1}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={pagination.page === 1}
              onClick={() => fetchArticles(pagination.page - 1)}
              className="px-8 py-4 rounded-[1.75rem] border border-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-3 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <div className="h-10 w-px bg-slate-100 mx-2" />
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchArticles(pagination.page + 1)}
              className="px-10 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-2xl shadow-indigo-100 transform active:scale-95"
            >
              Next
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


