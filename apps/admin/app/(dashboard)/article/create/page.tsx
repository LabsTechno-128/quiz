"use client";

import { useForm } from "react-hook-form";
import Select from "react-select";
import { privateRequest } from "@/app/config/axios.config";
import { useState, useEffect } from "react";
import ImageUpload from "@/app/components/ui/input/imageUpload";
import useFetch from "@/app/hooks/useFetch";
import PageHeader from "@/app/components/ui/pageHeader";
import {
  Loader2,
  ChevronRight,
  Tag,
  FileText,
  Globe,
  Image as ImageIcon,
  Type,
  Clock,
  User,
  Hash,
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";
import { useRouter } from "next/navigation";

export default function CreateArticleForm({ onSuccess }: { onSuccess: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: categoryData, loading: categoryFetchLoading } =
    useFetch("/categories");

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
      slug: "",
      subtitle: "",
      description: "",
      image: "",
      keywords: "",
      category: "",
      author: "",
      readingTime: "",
      isPublished: true,
    },
  });

  const isPublished = watch("isPublished");

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log(values,"-------->>");
      const payload = {
        ...values,
        readingTime: values.readingTime ? parseInt(values.readingTime) : null,
        keywords: values.keywords
          ? values.keywords.split(",").map((k: any) => k.trim())
          : [],
      };

      const res = await privateRequest.post("/articles", payload);
      Toastify.Success("Article created successfully!");
      reset();
      onSuccess?.(res.data);
      router.push("/article");
    } catch (err) {
      console.error(err);
      Toastify.Error("Failed to create article!");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#f8fafc", // slate-50
      borderColor: state.isFocused ? "#6366f1" : "#f1f5f9", // indigo-500 : slate-100
      borderRadius: "1.5rem",
      padding: "0.5rem 1rem",
      boxShadow: state.isFocused ? "0 0 0 4px #e0e7ff" : "none", // indigo-100
      "&:hover": {
        borderColor: "#6366f1",
      },
      transition: "all 0.2s ease",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6366f1"
        : state.isFocused
          ? "#eef2ff"
          : "white",
      color: state.isSelected ? "white" : "#1e293b",
      padding: "0.75rem 1.25rem",
      borderRadius: "0.75rem",
      margin: "0.25rem 0.5rem",
      cursor: "pointer",
      width: "auto",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "1.5rem",
      padding: "0.5rem",
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      border: "1px solid #f1f5f9",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.875rem",
      fontWeight: "500",
    }),
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <PageHeader
        title="Create New Article"
        actionLink={{ href: "/article", label: "Back to Articles" }}
      />

      <div className="max-w-6xl mx-auto mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-10 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/30 rounded-full -ml-40 -mb-40 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Type className="h-4 w-4 text-indigo-500" />
                    Article Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className={`w-full px-8 py-5 bg-slate-50 border ${errors.title ? "border-red-200 ring-red-50" : "border-slate-100"} rounded-[1.75rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-semibold text-lg placeholder:text-slate-300 placeholder:font-medium`}
                    placeholder="Enter a compelling title..."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs font-bold ml-4 animate-in fade-in">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Subtitle */}
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    Subtitle / Short Summary
                  </label>
                  <input
                    {...register("subtitle")}
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.75rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-300"
                    placeholder="Briefly describe what this article is about..."
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-500" />
                    Custom Slug
                  </label>
                  <input
                    {...register("slug", { required: "Slug is required" })}
                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.slug ? "border-red-200" : "border-slate-100"} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-sm placeholder:text-slate-300`}
                    placeholder="e.g. how-to-build-apps"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-500" />
                    Category
                  </label>
                  <Select
                    options={categoryData?.data?.map((p: any) => ({
                      value: p.name,
                      label: p.name,
                    }))}
                    isLoading={categoryFetchLoading}
                    isClearable
                    placeholder="Select category"
                    styles={customSelectStyles}
                    onChange={(option: any) =>
                      setValue("category", option ? option.value : "")
                    }
                  />
                </div>
              </div>

              {/* Description (HTML allowed) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  Article Content (HTML)
                </label>
                <div className="relative group">
                  <textarea
                    {...register("description")}
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-300 min-h-[400px] leading-relaxed mb-1"
                    placeholder="Write your article content here. You can use HTML tags for formatting..."
                  />
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-500 pointer-events-none group-focus-within:opacity-0 transition-opacity">
                    HTML ENABLED
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Media */}
            <div className="lg:col-span-4 space-y-8">
              {/* Featured Image */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-500" />
                  Featured Image
                </label>
                <div className="p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <ImageUpload
                    value={watch("image")}
                    onChange={(url: any) => setValue("image", url)}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Post Settings
                </h4>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 group transition-all">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Status</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">
                      {isPublished ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-500 ${isPublished ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"}`}
                    onClick={() => setValue("isPublished", !isPublished)}
                  >
                    <div
                      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-500 shadow-md ${isPublished ? "translate-x-7 rotate-45" : ""}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    {...register("isPublished")}
                    className="hidden"
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 ml-1 flex items-center gap-2">
                    <User className="h-3 w-3 text-indigo-400" />
                    Author Name
                  </label>
                  <input
                    {...register("author")}
                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                    placeholder="e.g. John Doe"
                  />
                </div>

                {/* Reading Time */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 ml-1 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    Reading Time (Mins)
                  </label>
                  <input
                    {...register("readingTime")}
                    type="number"
                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                    placeholder="e.g. 5"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 ml-1 flex items-center gap-2">
                    <Hash className="h-3 w-3 text-indigo-400" />
                    Keywords (CSV)
                  </label>
                  <input
                    {...register("keywords")}
                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                    placeholder="tech, news, guide"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Expert Editorial Mode
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  Every detail matters for your audience.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-16 py-5 bg-indigo-600 text-white rounded-[2rem] text-sm font-extrabold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Launch Article
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
