'use client';

import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { quizService } from '@/app/services/quiz.service';
import { Quiz } from '@/app/types/api.types';
import { use, useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function QuizQuestion({
  params
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  // Unwrap the promise
  const { slug, id } = use(params);
  const [timeLeft, setTimeLeft] = useState<number>(65); // ✅ explicitly typed number
  const [selected, setSelected] = useState<number | null>(null); // ✅ start as null

  const [quizzes, setQuizzes] = useState<Quiz>({} as Quiz);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await quizService.getById(id);
      setQuizzes(response);
      console.log("Quiz data:", response);
      // setQuizzes(response.result || []);
    } catch (e: unknown) {
      console.error("Error loading quizzes:", e);
      setError(e instanceof Error ? e.message : "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };
  // Countdown Timer
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Answer options
  const answers: string[] = [
    'None of my business, let somebody else take care of it',
    'Ask the person to leave the facility',
    'Escort the person to the security and raise a security incident',
    'Raise a security incident and go back doing your work'
  ];

  console.log("Quiz data:", quizzes); 
  if(isLoading){
    return <LoadingSpinner/>
  }
  return (
    <>
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">Purchase List</h1>
          <p className="text-normal pt-2">Here is your all pruchase list</p>
        </div>
      </div>

      <div className="flex flex-col items-center min-h-screen  py-12 px-4 max-w-6xl -mt-9 bg-white mx-auto rounded-md">
        {/* Timer */}
        <div className="bg-indigo-100 text-indigo-700 font-semibold px-6 py-2 rounded-lg mb-10 shadow-sm">
          Time Left: <span className="ml-1">{formatTime(timeLeft)}</span>
        </div>

        {/* Quiz Box */}
        {quizzes.questions.map((question: any, index: number) => (
        <div className="bg-[#F7F7F7] rounded-2xl shadow-md w-full max-w-lg p-8 relative mb-2" key={question.id}>
          {/* Back Button */}
          <button
            type="button"
            className="absolute top-6 left-6 text-gray-600 hover:text-indigo-600"
            onClick={() => window.history.back()} // ✅ optional: go back
          >
            <FiArrowLeft size={22} />
          </button>

          {/* Question */}
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-4 mt-2">
            sdf
          </h2>

          <p className="text-gray-600 text-sm text-center mb-8">
            You see a non-familiar face in the access-controlled areas of our
            office. The person does not have the MGL ID/Visitor/Staff/Vendor tag
            with him. What would you do?
          </p>

          {/* Answer Options */}
          <div className="flex flex-col gap-3">
            {question?.option.map((ans:{name:string}, i:number) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={`w-full border rounded-lg py-3 px-4 text-sm transition-all duration-200 ${selected === i
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 text-gray-700 hover:border-indigo-400'
                  }`}
              >
                {ans?.name}
              </button>
            ))}
          </div>
        </div>
        ))}
        {/* Submit Button */}
        <button
          type="button"
          className="mt-10 w-80 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          onClick={() =>
            alert(
              `You selected option ${selected !== null ? selected + 1 : 'none'}`
            )
          }
        >
          Submit
        </button>
      </div>
    </>
  );
}
