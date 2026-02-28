"use client";
import { useState, useEffect } from "react";
import { privateRequest } from "@/app/config/axios.config";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  HelpCircle,
  Users,
  Clock,
  FileText,
  Loader2
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";
import Link from "next/link";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await privateRequest.get(`/questions?search=${searchTerm}`);
      // Handle array or paginated response
      const data = response.data;
      setQuestions(Array.isArray(data) ? data : data.result || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      Toastify.Error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [searchTerm]);

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await privateRequest.delete(`/questions/${id}`);
        setQuestions(questions.filter((q: any) => q.id !== id));
        Toastify.Success("Quiz deleted successfully");
      } catch (error) {
        Toastify.Error("Failed to delete quiz");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
          <p className="text-sm text-slate-500 font-medium">Create and manage interactive assessments.</p>
        </div>
        <Link href="/question/create"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        ><Plus className="h-4 w-4zz" />
          Create New Quiz
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-500" /></div>
        ) : (
          questions.map((question: any) => (
            <div key={question.id} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {question.quiz?.name || "Uncategorized"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{question.title}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50/50 p-3 rounded-2xl text-center">
                  <FileText className="h-4 w-4 text-indigo-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-900">{question.answers?.length || 0}</p>
                  <p className="text-[10px] font-medium text-slate-500">Answers</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-2xl text-center">
                  <Users className="h-4 w-4 text-violet-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-900">{question.participantCount || 0}</p>
                  <p className="text-[10px] font-medium text-slate-500">Taken By</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-2xl text-center">
                  <Clock className="h-4 w-4 text-pink-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-900">{question.timeLimit ? `${question.timeLimit}m` : "No limit"}</p>
                  <p className="text-[10px] font-medium text-slate-500">Duration</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${question.isActive !== false ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                  <span className="text-xs font-bold text-slate-600">{question.isActive !== false ? "Active" : "Inactive"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 pl-4 pr-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all ml-2">
                    Preview
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
