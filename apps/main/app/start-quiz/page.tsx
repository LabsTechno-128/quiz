"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { quizService } from "../../services/quiz.service";
import { answerService } from "../../services/answer.service";
import { FiClock, FiUsers, FiAward, FiLoader, FiChevronRight } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { AiFillTrophy } from "react-icons/ai";

export default function StartQuizPage() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");
  const router = useRouter();

  const { data: quizData, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getById(quizId as string),
    enabled: !!quizId,
  });

  const { data: leaderboard, isLoading: leaderLoading } = useQuery({
    queryKey: ["leaderboard", quizId],
    queryFn: () => answerService.getLeaderboard(quizId as string),
    enabled: !!quizId,
  });

  const { data: mySubmissions } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => answerService.getMySubmissions(),
  });

  const quiz = quizData?.result;
  const hasParticipated = mySubmissions?.some((sub: any) => sub.quiz?.id === quizId);

  if (quizLoading || leaderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz not found</h2>
          <Link href="/" className="text-indigo-600 font-bold underline">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-[#1e1b4b] relative overflow-hidden py-24 px-6 lg:px-24">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
            <Image
              src={quiz.image || "/assets/quiz-placeholder.png"}
              alt={quiz.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-grow">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-6">
              <FaBrain /> Professional Quiz
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
              {quiz.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-indigo-200">
              <div className="flex items-center gap-3">
                <FiClock className="text-indigo-400" />
                <span className="font-bold">{quiz.duration} Minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <FiAward className="text-indigo-400" />
                <span className="font-bold">{quiz.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center gap-3">
                <FiUsers className="text-indigo-400" />
                <span className="font-bold">{quiz.participantCount || 0} Participants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Instructions</h2>
            <div className="prose prose-indigo text-gray-500 mb-10">
              <p>{quiz.description || "Challenge yourself and see where you rank! This quiz covers various topics to test your knowledge. Make sure you have a stable internet connection before starting."}</p>
              <ul className="space-y-4 mt-6 list-none p-0">
                {[
                  "You have only one attempt at this quiz.",
                  "Timer starts as soon as you begin.",
                  "Do not refresh the page during the quiz.",
                  "Points are awarded for each correct answer."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      {i + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {hasParticipated ? (
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-emerald-800 font-bold">You've already completed this quiz!</p>
                  <p className="text-emerald-600 text-sm">Check your score in the history section.</p>
                </div>
                <Link href="/my-quiz" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all">
                  View Result
                </Link>
              </div>
            ) : (
              <button
                onClick={() => router.push(`/question-ans?id=${quizId}`)}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 group"
              >
                Start Quiz Now <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100 sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <AiFillTrophy className="text-amber-500" /> Rankings
              </h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top 50</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {!leaderboard || leaderboard.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 font-medium">No rankings available yet.</p>
                  <p className="text-xs text-gray-300 mt-1">Be the first to participate!</p>
                </div>
              ) : (
                leaderboard.map((entry: any, index: number) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${index < 3 ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-gray-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' :
                      index === 1 ? 'bg-slate-300 text-white' :
                        index === 2 ? 'bg-orange-400 text-white' :
                          'bg-gray-100 text-gray-400'
                      }`}>
                      {index + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-gray-800 truncate">{entry.users?.[0]?.name || "Anonymous User"}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-600 font-black text-lg">{entry.correctScore}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Points</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
