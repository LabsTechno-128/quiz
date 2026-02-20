"use client";

export default function ArticlesSectionSkeleton() {
  return (
    <section className="mx-auto px-4 md:px-10 lg:px-24 pt-16">
      <div className="animate-pulse">

        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-10">
          <div className="h-7 w-48 bg-gray-300 rounded"></div>
          <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Articles Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-gray-300"></div>

              {/* Content */}
              <div className="py-5 px-2 space-y-3">
                {/* Date */}
                <div className="h-3 w-32 bg-gray-200 rounded"></div>

                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-300 rounded"></div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-11/12 bg-gray-200 rounded"></div>
                  <div className="h-3 w-9/12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
