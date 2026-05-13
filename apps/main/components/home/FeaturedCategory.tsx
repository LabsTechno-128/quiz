"use client";
import Image from "next/image";
import { Category } from "@/types/api.types";
import Link from "next/link";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedCategory({
  category,
}: {
  category: Category[];
}) {
  const swiperRef = useRef<any>(null);

  return (
    <section className=" overflow-hidden">
      <div className="    ">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Categories
            </h2>
            <div className="h-1 w-12 bg-indigo-600 rounded-full mt-2"></div>
          </div>

          {/* Custom Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Categories Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={16}
            slidesPerView={2.2}
            breakpoints={{
              480: {
                slidesPerView: 2.5,
              },
              640: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 5.5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 6.5,
                spaceBetween: 30,
              },
            }}
            className="!overflow-visible"
          >
            {category.map((cat) => (
              <SwiperSlide key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="  flex flex-col justify-center items-center gap-2 rounded-sm  shadow-lg p-2  bg-white shadow-slate-200 "
                >
                  <div className="w-[150px] h-[150px]    ">
                    <Image
                      src={cat.image || "/assets/card.png"}
                      alt={cat.name}
                      width={200}
                      height={200}
                      className="w-full object-contain    group-hover:scale-110 transition-transform duration-500 rounded-sm duration-700 hover:scale-105   "
                    />
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1  ">
                    {cat.name}
                  </h3>

                  {cat.quizCount !== undefined && (
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {cat.quizCount} Quizzes
                    </p>
                  )}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All */}
        {/* <div className="flex justify-center mt-12">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group">
            Explore All Categories
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div> */}

      </div>
    </section>
  );
}