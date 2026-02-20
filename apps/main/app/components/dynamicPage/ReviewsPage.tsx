'use client';
import { useState } from 'react';
import { FaStar, FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';

const reviews = [
  {
    id: 1,
    name: 'Mr. Lopez',
    date: 'July 2, 2020 03:29 PM',
    rating: 5,
    text: 'This quiz was super helpful for my biology exam! It covered all the major body systems and asked questions that really made me think. I loved how it mixed easy and tricky ones. Totally recommend it for students!',
    likes: 128
  },
  {
    id: 2,
    name: 'Darlene Robertson',
    date: 'July 2, 2020 1:04 PM',
    rating: 5,
    text: "Great quiz to use as a classroom activity or homework. The questions are clear and relevant, and it encourages critical thinking. I'd love to see a version with images or diagrams for visual learners.",
    likes: 82
  },
  {
    id: 3,
    name: 'Student User',
    date: 'July 2, 2020 12:45 PM',
    rating: 4,
    text: 'It was a little hard for me, but I still learned a lot. I wish it had hints or explanations after each question. Still cool though!',
    likes: 45
  }
];

const ratingStats = [
  { stars: 5, count: 2823 },
  { stars: 4, count: 38 },
  { stars: 3, count: 4 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 }
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState(5);
  const rating = 4.8; 
  const percentage = (rating / 5) * 100; 

  const filtered = reviews.filter((r) => r.rating === filter);

  return (
    <div className=" bg-white py-10  mx-auto">
      {/* Top Summary Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Average Rating */}
        <div className="bg-white border border-[#E4E9EE] rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Product Reviews</h2>
          <div className="flex items-center gap-4">
            {/* Rating Circle */}
            <div className="relative flex items-center justify-center w-20 h-20">
             
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#E5E7EB" 
                  strokeWidth="6"
                  fill="transparent"
                />
                
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#FACC15" 
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 * (1 - percentage / 100)}
                  strokeLinecap="round"
                />
              </svg>

              {/* Rating Text */}
              <span className="absolute text-2xl font-bold text-yellow-500">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Right side text */}
            <div>
              <div className="flex text-yellow-400 pb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-500 text-sm">from 32 reviews</p>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white border border-[#E4E9EE] rounded-xl p-5 w-full lg:w-2/3 shadow-sm">
          {ratingStats.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 mb-2">
              <span className="w-6 text-sm font-medium">{item.stars}.0</span>
              <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-2"
                  style={{ width: `${(item.count / 2823) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Review List */}
      <div className="flex flex-col lg:flex-row mt-10 gap-6">
        {/* Filter */}
        <div className="w-full lg:w-1/4 border border-[#E4E9EE] rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Reviews Filter</h3>
          <div className="flex flex-col gap-2 text-sm">
            {[5, 4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filter === r}
                  onChange={() => setFilter(r)}
                  className="accent-indigo-600"
                />
                {r} stars
              </label>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="w-full lg:w-3/4 ">
          <div className="flex gap-3 mb-4">
            <button className=" text-sm px-4 py-2 rounded border border-[#6A5BE2] text-[#6A5BE2]">
              All Reviews
            </button>
            <button className=" text-sm px-4 py-2 rounded border border-[#6A5BE2] text-[#6A5BE2]">
              With Description
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {filtered.map((r) => (
              <div key={r.id} className=" pb-5">
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-800 text-sm">{r.text}</p>
                <p className="text-gray-400 text-xs mt-2">{r.date}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-medium text-indigo-600">
                    {r.name}
                  </p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1 cursor-pointer">
                      <FaRegThumbsUp /> {r.likes}
                    </span>
                    <FaRegThumbsDown className="cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
