"use client";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  Loader2,
  ChevronRight,
  Package,
  Tag,
  FileText,
  DollarSign,
  User,
  Box,
  Link as LinkIcon,
  Star,
  Layers,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";
import PageHeader from "@/app/components/ui/pageHeader";
import ImageUpload from "@/app/components/ui/input/imageUpload";
import { customSelectStyles } from "@/utils/variable";

const productTypes = [
  { value: "all", label: "All" },
  { value: "ebook", label: "E-Book" },
  { value: "gadget", label: "Gadget" },
];

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: categoriesData, loading: categoriesFetchLoading } = useFetch("/categories");
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      type: "all",
      sellPrice: 0,
      buyPrice: 0,
      offerPrice: 0,
      stock: 0,
      fileUrl: "",
      image: "",
      isActive: true,
      rating: 0,
      categoryId: "",
      description: "",
    },
  });

  const isActive = watch("isActive");
  const currentType = watch("type");

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await privateRequest.get(`/products/${id}`);
      const product = response?.data?.result;

      reset({
        title: product.title || "",
        author: product.author || "",
        type: product.type || "all",
        sellPrice: Number(product.sellPrice) || 0,
        buyPrice: Number(product.buyPrice) || 0,
        offerPrice: Number(product.offerPrice) || 0,
        stock: product.stock || 0,
        fileUrl: product.fileUrl || "",
        image: product.image || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        rating: Number(product.rating) || 0,
        categoryId: product.category?.id || "",
        description: product.description || "",
      });
    } catch (err) {
      console.error(err);
      Toastify.Error("Failed to fetch product data!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Clean up values
      const payload = {
        ...values,
        sellPrice: Number(values.sellPrice),
        buyPrice: Number(values.buyPrice),
        offerPrice: values.offerPrice ? Number(values.offerPrice) : undefined,
        stock: values.stock ? Number(values.stock) : undefined,
        rating: values.rating ? Number(values.rating) : undefined,
        categoryId: values.categoryId || null,
      };

      if (isEditMode) {
        await privateRequest.patch(`/products/${id}`, payload);
        Toastify.Success("Product updated successfully!");
      } else {
        await privateRequest.post("/products", payload);
        Toastify.Success("Product created successfully!");
      }
      router.push("/product");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} product!`;
      Toastify.Error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={isEditMode ? "Edit Product" : "Create Product"}
        actionLink={{ href: "/product", label: "Back to List" }}
      />

      <div className="max-w-5xl mx-auto mt-8 mb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Package className="h-5 w-5 text-indigo-500" />
                Basic Information
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Product Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.title ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Modern Web Development"
                />
                {errors.title && <p className="text-red-500 text-xs font-bold ml-2">{errors.title.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-indigo-500" />
                    Author
                  </label>
                  <input
                    {...register("author")}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400"
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Type</label>
                  <Select
                    options={productTypes}
                    value={productTypes.find((t) => t.value === currentType)}
                    onChange={(opt) => setValue("type", opt?.value || "all")}
                    styles={customSelectStyles}
                    placeholder="Select Type"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Category
                </label>
                <Select
                  options={categoriesData?.result?.map((c: any) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  isLoading={categoriesFetchLoading}
                  value={categoriesData?.result?.find((c: any) => c.id === watch("categoryId")) ? {
                    value: watch("categoryId"),
                    label: categoriesData?.result?.find((c: any) => c.id === watch("categoryId")).name
                  } : null}
                  isClearable
                  placeholder="Select Category"
                  styles={customSelectStyles}
                  onChange={(option: any) => setValue("categoryId", option ? option.value : "")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400 min-h-[120px]"
                  placeholder="Product details..."
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column: Pricing & Logistics */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <DollarSign className="h-5 w-5 text-indigo-500" />
                Pricing & Logistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Buy Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("buyPrice")}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Sell Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("sellPrice", { required: "Required" })}
                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.sellPrice ? "border-red-200" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Offer Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("offerPrice")}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Box className="h-3.5 w-3.5 text-indigo-500" />
                    Stock
                  </label>
                  <input
                    type="number"
                    {...register("stock")}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <LinkIcon className="h-3.5 w-3.5 text-indigo-500" />
                  File URL (for E-Books)
                </label>
                <input
                  {...register("fileUrl")}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-indigo-500" />
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    {...register("rating")}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Status</label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-slate-100/50 h-[60px]">
                    <div
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${isActive ? "bg-indigo-600" : "bg-slate-300"}`}
                      onClick={() => setValue("isActive", !isActive)}
                    >
                      <div
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isActive ? "translate-x-6" : ""}`}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{isActive ? "Active" : "Inactive"}</p>
                    </div>
                    <input type="checkbox" {...register("isActive")} className="hidden" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Product Image</label>
                <div className="p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <ImageUpload value={watch("image")} onChange={(url) => setValue("image", url || "")} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium italic">
              * Ensure all prices and stock are correctly entered.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isEditMode ? "Update Product" : "Create Product"}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
