import Link from 'next/link';
import React from 'react';
import { FaBrain } from 'react-icons/fa';

const StartQuiz = () => {
  return (
    <div>
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">Purchase List</h1>
          <p className="text-normal pt-2">Here is your all pruchase list</p>
        </div>
      </div>

      <div className="  flex justify-center items-center ">
        <div className="bg-white rounded-2xl shadow-sm text-center p-8 w-full max-w-6xl -mt-9">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-indigo-100 rounded-full text-indigo-600">
              <FaBrain size={40} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Quiz Start 17 November 2025
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            Get Ready! The Quiz Kicks Off on 17 November 2025 at 10:00 PM
          </p>
          <Link href="/question-ans">
            <button className="px-4 py-2 w-80 text-sm rounded-md bg-gradient-to-r from-[#473BA4] to-[#6A5BE2] text-white font-medium hover:opacity-90 transition-all">
              Start Quiz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartQuiz;
