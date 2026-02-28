"use client";
import Image from "next/image";
import { Category } from "@/app/types/api.types";

export default function FeaturedCategory({
  category,
}: {
  category: Category[];
}) {
  return (
    <section className="pt-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured Category
          </h2>
          <button className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all text-nowrap">
            View Detail
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {category.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 mb-3">
                <Image
                  src={cat.image || cat.icon || "/assets/card.png"}
                  alt={cat.name}
                  width={64}
                  height={64}
                  className="object-contain mx-auto"
                />
              </div>
              <h3 className="text-gray-800 font-semibold">{cat.name}</h3>
              {cat.quizCount !== undefined && (
                <p className="text-sm text-gray-500">{cat.quizCount} Quizzes</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
