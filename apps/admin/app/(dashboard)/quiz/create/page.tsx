
"use client";

import { useForm } from "react-hook-form";
import Select from "react-select";
import { useState } from "react";
import { Loader2, ChevronRight, Layers, Tag, FileText, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";
import PageHeader from "@/app/components/ui/pageHeader";
import ImageUpload from "@/app/components/ui/input/imageUpload";

export default function CreateQuizzForm({ onSuccess }: { onSuccess: any }) {
    const [loading, setLoading] = useState(false);
    const { data: categoryData, loading: categoryFetchLoading } = useFetch("/categories");
    const router = useRouter();
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
            status: true,
        },
    });

    const status = watch("status");

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            console.log(values)
            const res = await privateRequest.post("/quiz", values);
            Toastify.Success("Category created successfully!");
            reset();
            onSuccess?.(res.data);
            router.push("/quiz");
        } catch (err) {
            console.error(err);
            Toastify.Error("Failed to create quiz!");
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
            backgroundColor: state.isSelected ? "#6366f1" : state.isFocused ? "#eef2ff" : "white",
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
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="Create Category"
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
                                    Quiz Name
                                </label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.name ? 'border-red-200 ring-red-50' : 'border-slate-100'} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
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
                                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.slug ? 'border-red-200 ring-red-50' : 'border-slate-100'} rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400`}
                                    placeholder="e.g. technology-news"
                                />
                                {errors.slug && (
                                    <p className="text-red-500 text-xs font-bold ml-2 animate-in fade-in duration-300">
                                        {errors.slug.message}
                                    </p>
                                )}
                            </div>



                            {/* Status */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-slate-100/50">
                                <div
                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${status ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    onClick={() => setValue("status", !status)}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${status ? 'translate-x-6' : ''}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Status</p>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        {status ? "Visible to public" : "Hidden from public"}
                                    </p>
                                </div>
                                <input type="checkbox" {...register("status")} className="hidden" />
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
                                <label className="text-sm font-bold text-slate-700 ml-1">Category Image</label>
                                <div className="p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                    <ImageUpload onChange={(url) => setValue("image", url || "")} />
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
                                    Create Category
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

