"use client";

export function QuizSectionSkeleton() {
  return (
    <section className="pt-16 text-center">
      <div className="mx-auto px-4 md:px-10 lg:px-24 animate-pulse">

        {/* Heading */}
        <div className="h-8 md:h-10 w-72 bg-gray-300 rounded mx-auto mb-3"></div>
        <div className="h-4 w-[420px] max-w-full bg-gray-200 rounded mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 text-left"
            >
              {/* Image */}
              <div className="h-40 w-full bg-gray-300 rounded-lg mb-4"></div>

              {/* Title */}
              <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>

              {/* Subtitle */}
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>

              {/* Meta */}
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="h-12 w-40 bg-gray-300 rounded-lg mx-auto mt-10"></div>
      </div>
    </section>
  );
}
