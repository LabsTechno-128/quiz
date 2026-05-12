"use client";
import { privateRequest } from "@/app/config/axios.config";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  BarChart3,
  Calendar,
  MoreHorizontal,
  Loader2,
  X,
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDeleteConfirm } from "@/app/context/DeleteModalProvider";
import Image from "next/image";
import StatusBadge from "@/app/components/ui/badge";
import HomepageCategoryModal from "./components/HomepageCategoryModal";
import { Home } from "lucide-react";

export default function CategoryPage() {
   const deleteConfirm = useDeleteConfirm();
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHomepageModalOpen, setIsHomepageModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ name: "", slug: "" }); 

  const fetchCategories = async () => {
    try {
      const response = await privateRequest.get("/categories");
      setCategories(response.data?.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Toastify.Error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    deleteConfirm(async () => {
      try {
        await privateRequest.delete(`/categories/${id}`);
        setCategories(categories.filter((c: any) => c.id !== id));
        Toastify.Success("Category deleted successfully");
      } catch (error) {
        Toastify.Error("Failed to delete category");
      }
    });
  };

  

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", slug: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
  };

  const filteredCategories =
    (categories.length > 0 &&
      categories?.filter(
        (c: any) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
      )) ||
    [];
console.log(categories)
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Organize your content with intuitive categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHomepageModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
          >
            <Home className="h-4 w-4 text-indigo-600" />
            Homepage Settings
          </button>
          <Link
            href="/category/create"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-medium">
              Loading categories...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Name & info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                    Resources
                  </th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     Description
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Slug
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
                {filteredCategories.map((category: any) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100`}
                        > 
                          {
                            category?.image ? (
                              <Image src={category.image} alt={category.name || "loading..."} className="h-10 w-10 rounded-xl" width={40} height={40} />
                            ) : (
                              <Layers className="h-5 w-5" />
                            )
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {category.name}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400">
                            Created:{" "}
                            {new Date(category.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">
                          {category.articles?.length || 0} items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 line-clamp-2 truncate">
                        {category.description || "No description"}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <code className="px-2 py-1 bg-slate-100 rounded text-[11px] font-mono text-slate-600">
                        /{category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <code className="px-2 py-1   rounded text-[11px] font-mono text-slate-600">
                        <StatusBadge status={category.status?'active':'inactive'}/>
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/category/create?id=${category.id}`}
                          className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-red-600 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4 " />
                        </button> 
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div> 
      <HomepageCategoryModal 
        isOpen={isHomepageModalOpen}
        onClose={() => setIsHomepageModalOpen(false)}
        allCategories={categories}
      />
    </div>
  );
}
