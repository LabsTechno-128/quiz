"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { publicRequest } from "@/app/config/axios.config";

export default function CreateBannerForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: "",
      title: "",
      subtitle: "",
      description: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        image: values.image || null,
        title: values.title || null,
        subtitle: values.subtitle || null,
        description: values.description || null,
      };

      const res = await publicRequest.post("/banners", payload);

      alert("Banner created successfully!");
      reset();
      onSuccess?.(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to create banner!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-6 border rounded-xl shadow-md"
    >
      {/* Image URL */}
      <div>
        <label className="font-medium">Image URL</label>
        <input
          {...register("image", {
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Invalid URL format",
            },
          })}
          type="url"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          placeholder="https://example.com/banner.jpg"
        />
        {errors.image && (
          <p className="text-red-600 text-sm">{errors.image.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="font-medium">Title</label>
        <input
          {...register("title", {
            maxLength: {
              value: 255,
              message: "Title must be under 255 characters",
            },
          })}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          placeholder="Summer Sale"
        />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="font-medium">Subtitle</label>
        <input
          {...register("subtitle", {
            maxLength: {
              value: 255,
              message: "Subtitle must be under 255 characters",
            },
          })}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          placeholder="Up to 50% off"
        />
        {errors.subtitle && (
          <p className="text-red-600 text-sm">{errors.subtitle.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          rows={4}
          placeholder="Special summer sale with amazing discounts"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg"
      >
        {loading ? "Saving..." : "Create Banner"}
      </button>
    </form>
  );
}