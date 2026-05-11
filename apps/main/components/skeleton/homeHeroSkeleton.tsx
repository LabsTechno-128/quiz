"use client";

export default function HeroSectionSkeleton() {
  return (
    <section className="bg-[#F7F7F7]">
      <div className="mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-4 md:px-10 lg:px-24 animate-pulse">
        {/* Left Text Skeleton */}
        <div className="lg:w-[50%] pb-10 space-y-6">
          {/* Title */}
          <div className="h-8 md:h-14 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-8 md:h-14 w-1/2 bg-gray-300 rounded"></div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="h-12 w-40 bg-gray-300 rounded-lg"></div>
            <div className="h-12 w-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Right Image Skeleton */}
        <div className="relative py-10">
          <div className="w-96 h-[360px] lg:w-[490px] lg:h-[500px] bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </section>
  );
}
