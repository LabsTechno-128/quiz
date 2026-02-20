'use client';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

export default function Physics() {
  return (
    <section className=" w-full md:max-w-[1200px] lg:max-w-[1440px]  mt-16 mx-auto px-4 md:px-10 lg:px-24">
      <div className=" mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 bg-[#F7F7F7]">
        {/* Left Text Section */}

        {/* Right Image Section */}
        <div className="relative py-10 lg:pl-14">
          <Image
            src="/assets/hero.png"
            alt="Quiz Illustration"
            width={300}
            height={100}
            className="object-contain "
          />
        </div>
        <div className="lg:w-[60%] px-5 lg:py-10 pb-10">
          <p className="text-normal mt-5">Featured Quiz of the Week</p>
          <h1 className="text-xl md:text-5xl font-extrabold text-title leading-tight pt-3">
            Boost Your Brainpower <br /> With Daily Quizzes
          </h1>
          <p className="text-normal mt-5">
            Challenge yourself with daily quizzes designed to sharpen your
            skills and boost your rankings. Master topics, win badges, and rise
            to the top!
          </p>
          <div className="flex items-center gap-1  text-gray-500 mb-5 text-[14px] pt-2">
            <FiStar className="text-yellow-400" size={16} />
            <span>4.8</span>
            <span className="mx-1">•</span>
            <span>1,238  Sold</span>
            <span className="mx-1">•</span>
            <span>15 MCQs + PDF</span>
          </div>

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
