// components/CategoryTable.jsx
"use client";
 import { useForm } from "react-hook-form";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  Loader2,
  ChevronRight,
  Layers,
  Tag,
  FileText,
  Globe,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";
import PageHeader from "@/app/components/ui/pageHeader";
import ImageUpload from "@/app/components/ui/input/imageUpload";
import { customSelectStyles } from "@/utils/variable"; 

export default function CreateForm( ) {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: categoryData, loading: categoryFetchLoading } =
    useFetch("/categories");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 
//   const id = params?.id as string;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      parent_id: null,
      status: true, 
    },
  });

  const status = watch("status");

  // Fetch category data for edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await privateRequest.get(`/categories/${id}`);
      const category = response?.data?.result;
      console.log(category)
      // Set form values with fetched data
      reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        image: category.image || "",
        parent_id: category.parent_id || null,
        status: category.status !== undefined ? category.status : true,
      });
    } catch (err) {
      console.error(err);
      Toastify.Error("Failed to fetch category data!");
    } finally {
      setLoading(false);
    }
  }; 
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (!values.parent_id) values.parent_id = null;
      if (isEditMode) {
        // Update existing category
        const res = await privateRequest.patch(`/categories/${id}`, values);
        Toastify.Success("Category updated successfully!");
      } else {
        // Create new category
        const res = await privateRequest.post("/categories", values);
        Toastify.Success("Category created successfully!");
      }
      reset();
      router.push("/category");
    } catch (err) {
      console.error(err);
      Toastify.Error(`Failed to ${isEditMode ? "update" : "create"} category!`);
    } finally {
      setLoading(false);
    }
  }; 
  return (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={isEditMode ? "Edit Category" : "Create Category"}
        actionLink={{ href: "/category", label: "Back to List" }}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-8 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  Category Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.name ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Technology"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  Slug
                </label>
                <input
                  {...register("slug", { required: "Slug is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.slug ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. technology-news"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              {/* Parent Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Parent Category
                </label>
                <Select
                  options={categoryData?.result?.map((p: any) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  isLoading={categoryFetchLoading}
                  isClearable
                  placeholder="Select a parent category"
                  styles={customSelectStyles}
                  onChange={(option: any) =>
                    setValue("parent_id", option ? option.value : null)
                  }
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-slate-100/50">
                <div
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${status ? "bg-indigo-600" : "bg-slate-300"}`}
                  onClick={() => setValue("status", !status)}
                >
                  <div
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${status ? "translate-x-6" : ""}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Status</p>
                  <p className="text-[11px] font-medium text-slate-500">
                    {status ? "Visible to public" : "Hidden from public"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...register("status")}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400 min-h-[120px]"
                  placeholder="Tell us more about this category..."
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Category Image
                </label>
                <div className="p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <ImageUpload
                    onChange={(url) => setValue("image", url || "")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium italic">
              * Redesigned for visual excellence.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isEditMode ? (
                    <>
                      Update Category
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Create Category
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
