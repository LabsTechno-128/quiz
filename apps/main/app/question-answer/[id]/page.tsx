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

  const [timeLeft, setTimeLeft] = useState<number>(65);

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

  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await quizService.getById(id);
      setQuizzes(response);

      // ✅ Initialize all questions with null option
      if (response?.questions?.length) {
        const initialSelections = response.questions.map((q: any) => ({
          questionId: q.id,
          optionId: "",
        }));
        setSelected(initialSelections);
      }
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
    const submitData = {
      quizId: id,
      questionAnswerDto: selected,
    };

    try {
      const response = await answerService.create(submitData);
      console.log("Submitted:", response);
    } catch (error) {
      console.error("Submit error:", error);
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
          <h1 className="text-3xl font-bold">Quiz</h1>
          <p className="text-normal pt-2">Answer all questions below</p>
        </div>
      </div>

      <div className="flex flex-col items-center min-h-screen py-12 px-4 max-w-6xl -mt-9 bg-white mx-auto rounded-md">
        {/* Timer */}
        <div className="bg-indigo-100 text-indigo-700 font-semibold px-6 py-2 rounded-lg mb-10 shadow-sm">
          Time Left: <span className="ml-1">{formatTime(timeLeft)}</span>
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
          className="mt-10 w-80 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          onClick={submitAnswer}
        >
          Submit
        </button>
      </div>
    </>
  );
}