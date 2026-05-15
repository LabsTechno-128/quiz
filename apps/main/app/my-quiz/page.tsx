"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { answerService } from "../../services/answer.service";
import { FiAward, FiClock, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import Link from "next/link";

export default function MyQuizPage() {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["my-quiz-submissions"],
    queryFn: () => answerService.getMySubmissions(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto text-white">
          <h1 className="text-4xl font-black flex items-center gap-4">
            <FiAward /> My Quiz History
          </h1>
          <p className="text-indigo-100 mt-2 text-lg">Track your performance and rankings.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        {!submissions || submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <FiAward size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">No quizzes taken yet</h2>
            <p className="text-gray-500 mt-3 mb-10 max-w-md mx-auto">Participate in available quizzes to see your results and rank on the leaderboard!</p>
            <Link
              href="/quiz"
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Explore Quizzes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FiAward size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xs font-bold text-gray-400 uppercase tracking-widest">Score</p>
                      <p className="text-2xl font-black text-gray-900">
                        {submission.correctScore}<span className="text-gray-300">/{submission.totalQuestion}</span>
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{submission.quiz?.name || "Quiz Result"}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                    <FiClock size={14} /> Completed on {new Date(submission.createdAt).toLocaleDateString()}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <FiCheckCircle />
                      <span className="text-sm font-bold">{submission.correctScore} Correct</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-600">
                      <FiXCircle />
                      <span className="text-sm font-bold">{submission.wrongScore} Wrong</span>
                    </div>
                  </div>

                  <Link
                    href={`/start-quiz?id=${submission.quiz?.id}`}
                    className="w-full mt-4 flex items-center justify-center py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"
                  >
                    View Leaderboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
