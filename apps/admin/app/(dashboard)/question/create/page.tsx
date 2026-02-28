"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
  Loader2,
  ChevronRight,
  Tag,
  FileText,
  Globe,
  CheckCircle,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";
import PageHeader from "@/app/components/ui/pageHeader";
import Select from "react-select";
import useFetch from "@/app/hooks/useFetch";

export default function CreateQuestionForm({ onSuccess }: { onSuccess: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: quizData, loading: quizFetchLoading } = useFetch("/quiz");
  console.log(quizData, "quizData");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: true,
      quizId: "",
      option: [
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "option",
  });

  const status = watch("status");

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Ensure at least one correct answer
      const hasCorrect = values.option.some((opt: any) => opt.isCorrect);
      if (!hasCorrect) {
        Toastify.Error("Please select at least one correct answer.");
        setLoading(false);
        return;
      }

      console.log(values, "----");

      const res = await privateRequest.post("/questions", values);
      Toastify.Success("Question created successfully!");
      reset();
      onSuccess?.(res.data);
      // router.push("/question");
    } catch (err) {
      console.error(err);
      Toastify.Error("Failed to create question!");
    } finally {
      setLoading(false);
    }
  };
  const options = watch("option");

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Create Question"
        actionLink={{ href: "/questions", label: "Back to List" }}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100 space-y-8 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                Parent Category
              </label>
              <Select
                options={quizData?.result?.map((p: any) => ({
                  value: p.id,
                  label: p.name,
                }))}
                isLoading={quizFetchLoading}
                isClearable
                placeholder="Select a parent category"
                styles={customSelectStyles}
                onChange={(quiz: any) =>
                  setValue("quizId", quiz ? quiz.value : null)
                }
              />
            </div>
            <div className="space-y-6">
              {/* Question Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  Question Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-6 py-4 bg-slate-50 border rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="Enter question..."
                />
                {errors.name && (
                  <p className="text-red-500 text-xs ml-2">
                    {errors.name.message as string}
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
                  className="w-full px-6 py-4 bg-slate-50 border rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="question-slug"
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs ml-2">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full px-6 py-4 bg-slate-50 border rounded-[1.5rem] focus:ring-4 focus:ring-indigo-100 outline-none"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* 4 Options Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-700">
              Question Options (4 Required)
            </h3>

            {fields.map((field, index) => {
              const isCorrect = options?.[index]?.isCorrect;

              return (
                <div
                  key={field.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100"
                >
                  <input
                    {...register(`option.${index}.name`, {
                      required: "Option is required",
                    })}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-6 py-3 bg-white border rounded-[1.2rem] focus:ring-2 focus:ring-indigo-100 outline-none"
                  />

                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <CheckCircle
                      className={`h-5 w-5 transition-colors ${
                        isCorrect ? "text-green-500" : "text-gray-400"
                      }`}
                    />

                    <span
                      className={`${
                        isCorrect
                          ? "text-green-600 font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      Correct
                    </span>

                    <input
                      type="checkbox"
                      {...register(`option.${index}.isCorrect`)}
                      className="hidden"
                    />
                  </label>
                </div>
              );
            })}

            {errors.option && (
              <p className="text-red-500 text-xs">
                All 4 options must be filled.
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-sm font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Create Question
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
