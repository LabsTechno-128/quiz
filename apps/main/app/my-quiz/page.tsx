'use client';

import { useEffect, useState } from 'react';
import { FaBrain } from 'react-icons/fa';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function QuizCountdown() {
  const targetDate = new Date('2025-11-17T22:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <>
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">Purchase List</h1>
          <p className="text-normal pt-2">Here is your all pruchase list</p>
        </div>
      </div>
      <div className="  flex justify-center items-center">
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

          {/* Countdown */}
          <div className="flex justify-center flex-wrap gap-4">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOUR', value: timeLeft.hours },
              { label: 'MINUTE', value: timeLeft.minutes },
              { label: 'SECOND', value: timeLeft.seconds }
            ].map((item, i) => (
              <div
                key={i}
                className="w-24 h-24 bg-indigo-50 rounded-lg flex flex-col justify-center items-center"
              >
                <span className="text-3xl font-bold text-indigo-600">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-xs font-medium text-gray-600 mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
