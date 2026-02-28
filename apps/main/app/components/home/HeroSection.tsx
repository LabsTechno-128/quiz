"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import HeroSectionSkeleton from "../skeleton/homeHeroSkeleton";
import { Banner } from "@/app/types/api.types";
import { bannerService } from "@/app/services/banner.service";

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
      setBanners(data.result?.length > 0 ? data.result : [getDefaultBanner()]);
      // console.log(data,"---------");
    } catch (e) {
      console.error("Error loading banners:", e);
      // Use default banner on error
      setBanners([getDefaultBanner()]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultBanner = (): Banner => ({
    id: "default",
    name: "Boost Your Brainpower",
    subname: "With Daily Quizzes",
    description:
      "Challenge yourself with daily quizzes designed to sharpen your skills and boost your rankings. Master topics, win badges, and rise to the top!",
    image: "/assets/hero.png",
    buttonText: "Take Quiz Now",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const banner = banners[currentBanner] || getDefaultBanner();

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  return (
    <section className="bg-[#F7F7F7] ">
      <div className=" mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-4 md:px-10 lg:px-24">
        {/* Left Text Section */}
        <div className="lg:w-[50%] pb-10">
          <h1 className="text-xl md:text-5xl font-extrabold text-title leading-tight">
            {banner.name}{" "}
            {banner.subname && (
              <>
                <br />
                {banner.subname}
              </>
            )}
          </h1>
          <p className="text-normal mt-5">
            {banner.description ||
              "Challenge yourself with daily quizzes designed to sharpen your skills and boost your rankings. Master topics, win badges, and rise to the top!"}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition">
              {banner.buttonText || "Take Quiz Now"}
            </button>
            {banner.link && (
              <a href={banner.link}>
                <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
                  View Detail
                </button>
              </a>
            )}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative py-10">
          {banner.image ? (
            <Image
              src={banner.image}
              alt={banner.name}
              width={490}
              height={500}
              className="object-contain w-96 lg:w-full"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
