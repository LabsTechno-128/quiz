// components/bookTable.jsx
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
  const { data: bookData, loading: bookFetchLoading } =
    useFetch("/book");
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
      title: "",
      description: "",
      image: "",
      sellPrice: 0,
      buyPrice: 0,
      author: "",
    },
  });

  // const status = watch("status");

  // Fetch book data for edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchbookData();
    }
  }, [id]);

  const fetchbookData = async () => {
    try {
      setLoading(true);
      const response = await privateRequest.get(`/book/${id}`);
      const book = response?.data?.result;
      console.log(book)
      // Set form values with fetched data
      reset({
        title: book?.title || "",
        description: book?.description || "",
        image: book?.image || "",
        sellPrice: book?.sellPrice || 0,
        buyPrice: book?.buyPrice || 0,
        author: book?.author || "",
      });
    } catch (err) {
      console.error(err);
      Toastify.Error("Failed to fetch book data!");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (values?.buyPrice >= values?.sellPrice) {
        Toastify.Error("buyPrice must be less than sellPrice");
        return;
      }
      values.buyPrice = Number(values.buyPrice);
      values.sellPrice = Number(values.sellPrice);
      if (isEditMode) {
        // Update existing book
        const res = await privateRequest.patch(`/book/${id}`, values);
        Toastify.Success("book updated successfully!");
      } else {
        // Create new book
        const res = await privateRequest.post("/book", values);
        Toastify.Success("book created successfully!");
      }
      reset();
      router.push("/book");
    } catch (err) {
      console.error(err);
      Toastify.Error(`Failed to ${isEditMode ? "update" : "create"} book!`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={isEditMode ? "Edit book" : "Create book"}
        actionLink={{ href: "/book", label: "Back to List" }}
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
                  book Name
                </label>
                <input
                  {...register("title", { required: "Title is required" })}

                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.title ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Technology"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* author name  */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  Author Name
                </label>
                <input
                  {...register("author", { required: "Author name is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.author ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. Technology"
                />
                {errors.author && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.author.message}
                  </p>
                )}
              </div>
              {/* buyPrice */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  buyPrice
                </label>
                <input
                  type="number"
                  {...register("buyPrice", { required: "buyPrice is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.buyPrice ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. 100"
                />
                {errors.buyPrice && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.buyPrice.message}
                  </p>
                )}
              </div>

              {/* sell price 
               */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-indigo-500" />
                  sellPrice
                </label>
                <input
                  type="number"
                  {...register("sellPrice", { required: "sellPrice is required" })}
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.sellPrice ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="e.g. 100"
                />
                {errors.sellPrice && (
                  <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                    {errors.sellPrice.message}
                  </p>
                )}
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
                  placeholder="Tell us more about this book..."
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  book Image
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
                      Update book
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Create book
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
