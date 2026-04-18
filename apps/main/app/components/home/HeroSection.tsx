"use client";
import { useEffect, useState } from "react";
import HeroSectionSkeleton from "../skeleton/homeHeroSkeleton";
import { Banner } from "@/app/types/api.types";
import { bannerService } from "@/app/services/banner.service";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const data = await bannerService.getAll();
      setBanners(data.result?.length > 0 ? data.result : []);
    } catch (e) {
      console.error("Error loading banners:", e);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 👉 Auto slide (optional)
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  if (banners.length === 0) {
    return <div className="text-center py-10">No banners found</div>;
  }

  return (
    <section className="bg-[#F7F7F7]">
      <div className="relative overflow-hidden">

        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentBanner * 100}%)`,
          }}
        >
          {banners.map((ban) => (
            <Link key={ban.id} className="min-w-full" href={'/'}>
              <Image
                width={1440}
                height={400}
                src={ban.image}
                alt={ban.name}
                className="w-full  object-cover"
              />
            </Link>
          ))}
        </div>

        {/* ⬅️ Prev Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
        >
          ❮
        </button>

        {/* ➡️ Next Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
        >
          ❯
        </button>

        {/* 🔘 Dots */}
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {banners.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${currentBanner === i ? "bg-white" : "bg-gray-400"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}