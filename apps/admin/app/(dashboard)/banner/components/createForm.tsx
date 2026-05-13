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

export default function CreateForm() {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch categories and products for selectors
  const { data: categoryData, loading: categoryFetchLoading } = useFetch("/categories");
  const { data: productData, loading: productFetchLoading } = useFetch("/products");

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: "",
      name: "",
      subName: "",
      description: "",
      status: true,
      categoryId: "",
      productIds: [] as string[],
    },
  });

  const status = watch("status");
  const selectedCategoryId = watch("categoryId");
  const selectedProductIds = watch("productIds") || [];

  // Fetch banner data for edit mode
  useEffect(() => {
    const fetchBanner = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          setLoading(true);
          const response = await privateRequest.get(`/banners/${id}`);
          const banner = response?.data;
          if (banner) {
            reset({
              image: banner.image || "",
              name: banner.name || "",
              subName: banner.subName || "",
              description: banner.description || "",
              status: banner.status,
              categoryId: banner.category?.id || "",
              productIds: banner.products?.map((p: any) => p.id) || [],
            });
          }
        } catch (err) {
          console.error(err);
          Toastify.Error("Failed to fetch banner data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBanner();
  }, [id, reset]);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        image: values.image || null,
        name: values.name || null,
        subName: values.subName || null,
        description: values.description || null,
        status: values.status ?? true,
        categoryId: values.categoryId || null,
        productIds: values.productIds || [],
      };

      if (isEditMode) {
        await privateRequest.patch(`/banners/${id}`, payload);
        Toastify.Success("Banner updated successfully");
      } else {
        await privateRequest.post("/banners", payload);
        Toastify.Success("Banner created successfully");
      }
      router.push("/banner");
      reset();
    } catch (err) {
      console.log(err);
      Toastify.Error(isEditMode ? "Failed to update banner" : "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categoryData?.result?.map((cat: any) => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  const productOptions = productData?.result?.map((prod: any) => ({
    value: prod.id,
    label: prod.title,
  })) || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={isEditMode ? "Edit Banner" : "Create Banner"}
        actionLink={{ href: "/banner", label: "Back to List" }}
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
                  Banner Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.name ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Summer Sale"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Sub Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  Sub Name
                </label>
                <input
                  {...register("subName", { required: "Sub Name is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.subName ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Up to 50% off"
                />
                {errors.subName && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.subName.message}
                  </p>
                )}
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Link to Category (Auto-adds all products)
                </label>
                <Select
                  options={categoryOptions}
                  isLoading={categoryFetchLoading}
                  placeholder="Select a category..."
                  isClearable
                  styles={customSelectStyles}
                  value={categoryOptions.find((opt: any) => opt.value === selectedCategoryId) || null}
                  onChange={(opt: any) => setValue("categoryId", opt?.value || "")}
                  className="rounded-[1.5rem]"
                />
              </div>

              {/* Specific Products Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  Specific Products (Multi-select)
                </label>
                <Select
                  isMulti
                  options={productOptions}
                  isLoading={productFetchLoading}
                  placeholder="Select specific products..."
                  styles={customSelectStyles}
                  value={productOptions.filter((opt: any) => selectedProductIds.includes(opt.value))}
                  onChange={(opts: any) => setValue("productIds", opts ? opts.map((o: any) => o.value) : [])}
                  className="rounded-[1.5rem]"
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
                  placeholder="Tell us more about this banner..."
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Banner Image
                </label>
                <div className="p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <ImageUpload
                    onChange={(url) => setValue("image", url || "")}
                    value={watch("image")}
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
                      Update Banner
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Create Banner
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
