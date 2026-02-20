'use client';
import Image from 'next/image';
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

export default function SliderPage() {
  const images = ['/assets/hero.png', '/assets/hero2.png', '/assets/hero3.png'];

  const [current, setCurrent] = useState(0);

  // Auto slide every 3 seconds
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setCurrent((prev) => (prev + 1) % images.length);
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-10   overflow-hidden  ">
        {/* Right Image Slider Section */}
        <div className="w-full md:w-[50%] relative py-10 h-[400px] flex items-center justify-center bg-[#F7F7F7] rounded">
          {/* Slider Images */}
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute transition-opacity duration-1000  ${
                index === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`Hero ${index + 1}`}
                width={300}
                height={300}
                className="object-contain "
              />
            </div>
          ))}

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100"
          >
            &#10094;
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100"
          >
            &#10095;
          </button>
        </div>
        {/* Left Text Section */}
        <div className="w-full md:w-[50%]">
          <h1 className="text-xl md:text-3xl font-extrabold text-title leading-tight">
            Human Body System
          </h1>
          <div className="flex items-center gap-1  text-gray-500 mb-5 text-[14px] pt-5">
            <FiStar className="text-yellow-400" size={16} />
            <span>4,8</span>
            <span className="mx-1">•</span>
            <span>1,238 So Sold</span>
            <span className="mx-1">•</span>
            <span>15 MCQs + PDF</span>
          </div>
          <p className="text-normal mt-5">
            Challenge yourself with daily quizzes designed to sharpen your
            skills and boost your rankings. Master topics, win badges, and rise
            to the top!
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary transition">
              Take Quiz Now
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
              View Detail
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
