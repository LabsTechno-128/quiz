"use client";

export default function FeaturedCategorySkeleton() {
  return (
    <section className="pt-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-24 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-10">
          <div className="h-8 md:h-10 w-56 bg-gray-300 rounded"></div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Category Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mb-3 bg-gray-300 rounded-full"></div>

              {/* Name */}
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>

              {/* Quiz Count */}
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
