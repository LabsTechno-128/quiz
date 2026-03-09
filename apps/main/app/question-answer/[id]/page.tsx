"use client";

import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import { answerService } from "@/app/services/answer.service";
import { quizService } from "@/app/services/quiz.service";
import { Quiz } from "@/app/types/api.types";
import { use, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function QuizQuestion({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = use(params);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // ✅ Multiple question support
  const [selected, setSelected] = useState<
    { questionId: string; optionId: string   }[]
  >([]);

  const [quizzes, setQuizzes] = useState<Quiz>({} as Quiz);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      // Auto-submit when time runs out
      submitAnswer();
    }
  }, [timeLeft, timerActive, isSubmitted]);

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quizService.getById(id, true); // Include relations to get questions
      setQuizzes(response?.result);

      // ✅ Initialize all questions with null option
      if (response?.result?.questions?.length) {
        const initialSelections = response.result.questions.map((q: any) => ({
          questionId: q.id,
          optionId: "",
        }));
        setSelected(initialSelections);
      }

      // Set timer from API duration (convert minutes to seconds)
      const durationInMinutes = response?.result?.duration || 10; // Default to 10 minutes if not provided
      const durationInSeconds = durationInMinutes * 60;
      setTimeLeft(durationInSeconds);
      
      // Start timer when quiz is loaded
      setTimerActive(true);
    } catch (e: unknown) {
      console.error("Error loading quizzes:", e);
      setError(e instanceof Error ? e.message : "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelect = (questionId: string, optionId: string) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.questionId === questionId
          ? { ...item, optionId }
          : item
      )
    );
  };

  const submitAnswer = async () => {
    if (isSubmitted) return; // Prevent multiple submissions
    
    setIsSubmitted(true);
    setTimerActive(false); // Stop timer

    const submitData = {
      quizId: id,
      questionAnswerDto: selected,
    };

    try {
      const response = await answerService.create(submitData);
      console.log("Submitted:", response);
      
      // Redirect to results page or show success message
      // You can customize this based on your app flow
      alert("Quiz submitted successfully!");
      
      // Optional: redirect to results page
      // window.location.href = `/quiz-results/${response.result?.id}`;
      
    } catch (error) {
      console.error("Submit error:", error);
      // alert("Failed to submit quiz. Please try again.");
      // Allow retry on error
      setIsSubmitted(false);
      setTimerActive(true);
    }
  };
 

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex gap-4 justify-between bg-[#F7F7F7] py-14 px-4 lg:px-24 max-w-[1440px] mx-auto ">
        <div>
          <h1 className="text-3xl font-bold">{quizzes?.name || "Quiz"}</h1>
          <p className="text-normal pt-2">Answer all questions below</p>
          {quizzes?.duration && (
            <p className="text-sm text-gray-500 mt-1">Duration: {quizzes.duration} minutes</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center min-h-screen py-12 px-4 max-w-6xl -mt-9 bg-white mx-auto rounded-md">
        {/* Timer */}
        <div className={`font-semibold px-6 py-2 rounded-lg mb-10 shadow-sm ${
          timeLeft <= 10 
            ? 'bg-red-100 text-red-700 animate-pulse' 
            : 'bg-indigo-100 text-indigo-700'
        }`}>
          {isSubmitted ? (
            <span>Quiz Submitted!</span>
          ) : (
            <>
              Time Left: <span className="ml-1 font-mono">{formatTime(timeLeft)}</span>
            </>
          )}
        </div>

        {/* Questions */}
        {quizzes?.questions?.map((question: any) => (
          <div
            className="bg-[#F7F7F7] rounded-2xl shadow-md w-full max-w-lg p-8 relative mb-6"
            key={question.id}
          > 
            {/* Back Button */}
            <button
              type="button"
              className="absolute top-6 left-6 text-gray-600 hover:text-indigo-600"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft size={22} />
            </button>
        
            {/* Question Title */}
            <h2 className="text-center text-lg font-semibold text-gray-900 mb-4 mt-2">
              {question?.title || "Question"}  
            </h2>

            <p className="text-gray-600 text-sm text-center mb-8">
              {question?.description || ""}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {question?.option?.map(
                (ans: { name: string; id: string }) => {
                  const isSelected =
                    selected.find(
                      (s) => s.questionId === question.id
                    )?.optionId === ans.id;

                  return (
                    <button
                      key={ans.id}
                      type="button"
                      onClick={() =>
                        handleSelect(question.id, ans.id)
                      }
                      className={`w-full border rounded-lg py-3 px-4 text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-700 hover:border-indigo-400"
                      }`}
                    >
                      {ans?.name}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="button"
          className={`mt-10 w-80 font-semibold py-3 rounded-lg transition-all duration-200 ${
            isSubmitted
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          onClick={submitAnswer}
          disabled={isSubmitted}
        >
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting...
            </div>
          ) : (
            'Submit Quiz'
          )}
        </button>

        {/* Quiz Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Questions: {quizzes?.questions?.length || 0}</p>
          <p className="mt-1">Duration: {quizzes?.duration || 10} minutes</p>
          <p className="mt-1">{isSubmitted ? 'Quiz has been submitted' : 'Answer all questions before time runs out'}</p>
        </div>
      </div>
    </>
  );
}