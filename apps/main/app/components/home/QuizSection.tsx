'use client';
import { useState, useEffect } from 'react';
import QuizCard from '../card/QuizCard';
import ErrorMessage from '../common/ErrorMessage';
import { QuizSectionSkeleton } from '../skeleton/homeQuizSkeleton';
import { Quiz } from '@/app/types/api.types';
import { quizService } from '@/app/services/quiz.service';

export default function QuizSection() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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
      const response = await quizService.getAll({ page: 1, limit: 4 });
      setQuizzes(response.result || []);
    } catch (e: unknown) {
      console.error("Error loading quizzes:", e);
      setError(e instanceof Error ? e.message : "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id]
    );
  };

  /** ✅ Skeleton instead of spinner */
  if (isLoading) {
    return <QuizSectionSkeleton />;
  }

  if (error) {
    return (
      <section className="pt-16 text-center">
        <div className="mx-auto px-4 md:px-10 lg:px-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-title">
            Available Quiz on Quzzy
          </h2>
          <p className="text-normal mb-10">
            Choose from a variety of topics. Buy now and get a free PDF guide with
            each quiz!
          </p>
          <ErrorMessage message={error} onRetry={loadQuizzes} />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-16 text-center">
      <div className="mx-auto px-4 md:px-10 lg:px-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-title">
          Available Quiz on Quzzy
        </h2>
        <p className="text-normal mb-10">
          Choose from a variety of topics. Buy now and get a free PDF guide with
          each quiz!
        </p>

        {quizzes.length === 0 ? (
          <p className="text-gray-500">No quizzes available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                isFavorite={favorites.includes(quiz.id)}
                onToggleFavorite={() => toggleFavorite(quiz.id)}
              />
            ))}
          </div>
        )}

        <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition mt-10">
          View Detail
        </button>
      </div>
    </section>
  );
}
