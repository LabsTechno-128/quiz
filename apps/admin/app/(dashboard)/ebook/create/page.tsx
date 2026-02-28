"use client";

import { useForm } from "react-hook-form";
import Select from "react-select";
import { useState } from "react";
import { publicRequest } from "@/app/config/axios.config";

export default function CreateEbookForm({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      author: "",
      categories: [],
      ebookFileUrl: "",
      coverImageUrl: "",
      publishedAt: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        categories: values.categories?.length ? values.categories : [],
        publishedAt: values.publishedAt || null,
        ebookFileUrl: values.ebookFileUrl || null,
        coverImageUrl: values.coverImageUrl || null,
      };

      const res = await publicRequest.post("/ebooks", payload);

      alert("Ebook created successfully!");
      reset();
      onSuccess?.(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to create ebook!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-white rounded-xl p-6 shadow-md border"
    >
      {/* Title */}
      <div>
        <label className="font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Ebook title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={3}
          placeholder="Ebook description"
        />
      </div>

      {/* Author */}
      <div>
        <label className="font-medium">Author</label>
        <input
          {...register("author")}
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="Author name"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="font-medium">Categories</label>
        <Select
          isMulti
          options={[]}
          className="mt-1"
          placeholder="Select categories"
          onChange={(option: any) =>
            setValue(
              "categories",
              option ? option.map((o: any) => o.value) : [],
            )
          }
        />
      </div>

      {/* Ebook File URL */}
      <div>
        <label className="font-medium">Ebook File URL</label>
        <input
          {...register("ebookFileUrl")}
          type="url"
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="https://example.com/ebook.pdf"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="font-medium">Cover Image URL</label>
        <input
          {...register("coverImageUrl")}
          type="url"
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      {/* Published Date */}
      <div>
        <label className="font-medium">Published At</label>
        <input
          {...register("publishedAt")}
          type="datetime-local"
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Create Ebook"}
      </button>
    </form>
  );
}
