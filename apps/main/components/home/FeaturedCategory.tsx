"use client";
import Image from "next/image";
import { Category } from "@/types/api.types";
import Link from "next/link";
import { useRef } from "react";

export default function FeaturedCategory({
  category,
}: {
  category: Category[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-8 bg-white pb-6">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured Category
          </h2>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="border px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="border px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              →
            </button>
          </div>
        </div>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
        >
          {category.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="min-w-[140px] bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex-shrink-0 flex flex-col items-center text-center"
            >
              <div className="max-w-32 max-h-32 pb-2 pt-3 px-3">
                <Image
                  src={cat.image || "/assets/card.png"}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="object-contain mx-auto"
                />
              </div>

              <span className="text-gray-800 leading-4 pb-1">
                {cat.name}
              </span>

              {cat.quizCount !== undefined && (
                <p className="text-sm text-gray-500">
                  {cat.quizCount} Quizzes
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* Bottom Right Button */}
        <div className="flex justify-end mt-4">
          <button className="border border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all">
            View Detail
          </button>
        </div>

      </div>
    </section>
  );
}