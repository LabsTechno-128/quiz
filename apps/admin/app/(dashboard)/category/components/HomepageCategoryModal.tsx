"use client";
import { useState, useEffect } from "react";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";
import { 
  X, 
  Loader2, 
  CheckCircle2, 
  Search, 
  Home, 
  Check, 
  Layers,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

interface HomepageCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCategories: any[];
}

export default function HomepageCategoryModal({ 
  isOpen, 
  onClose, 
  allCategories 
}: HomepageCategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchHomepageCategories();
    }
  }, [isOpen]);

  const fetchHomepageCategories = async () => {
    try {
      setLoading(true);
      const response = await privateRequest.get("/categories/all/homepage-category-product");
      const homepageCategories = response.data?.result || [];
      setSelectedIds(homepageCategories.map((c: any) => c.id));
    } catch (error) {
      console.error("Error fetching homepage categories:", error);
      Toastify.Error("Failed to fetch homepage categories");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await privateRequest.post("/categories/homepage-category-product", {
        categoryIds: selectedIds
      });
      Toastify.Success("Homepage categories updated successfully");
      onClose();
    } catch (error) {
      console.error("Error saving homepage categories:", error);
      Toastify.Error("Failed to update homepage categories");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = allCategories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Home className="h-6 w-6 text-indigo-600" />
              Homepage Categories
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Select categories to feature on your homepage.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="px-8 max-h-[400px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Loading selection...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 py-2">
              {filteredCategories.map((category) => {
                const isSelected = selectedIds.includes(category.id);
                return (
                  <div 
                    key={category.id}
                    onClick={() => handleToggle(category.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected 
                        ? "bg-indigo-50/50 border-indigo-200 shadow-sm" 
                        : "bg-white border-slate-50 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={category.name} 
                          width={48} 
                          height={48} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Layers className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? "text-indigo-900" : "text-slate-900"}`}>
                        {category.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {category.slug}
                      </p>
                    </div>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-indigo-600 text-white scale-110" 
                        : "bg-slate-100 text-transparent"
                    }`}>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
              {filteredCategories.length === 0 && (
                <div className="py-10 text-center text-slate-400 italic">
                  No categories found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400 font-medium">
            {selectedIds.length} categories selected for homepage
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all border border-transparent hover:border-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 group"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Save Changes
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
