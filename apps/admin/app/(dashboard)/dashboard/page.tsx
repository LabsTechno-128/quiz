"use client";
import { useState, useEffect } from "react";
import {
  Users as UsersIcon,
  Layers,
  HelpCircle,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { privateRequest } from "@/app/config/axios.config";

const data = [
  { name: "Jan", users: 400, quiz: 240, blogs: 240 },
  { name: "Feb", users: 300, quiz: 139, blogs: 221 },
  { name: "Mar", users: 200, quiz: 980, blogs: 229 },
  { name: "Apr", users: 278, quiz: 390, blogs: 200 },
  { name: "May", users: 189, quiz: 480, blogs: 218 },
  { name: "Jun", users: 239, quiz: 380, blogs: 250 },
  { name: "Jul", users: 349, quiz: 430, blogs: 210 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
  loading,
}: {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendValue: string;
  color: string;
  loading: boolean;
}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div
        className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110 duration-300`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-bold ${trend === "up" ? "text-emerald-500" : "text-rose-500"} bg-slate-50 px-2 py-1 rounded-lg`}
      >
        {trend === "up" ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        <span>{trendValue}</span>
      </div>
    </div>
    <div className="mt-6">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin text-slate-200 mt-1" />
      ) : (
        <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
          {value}
        </h3>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    quizzes: 0,
    categories: 0,
    articles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, quizzesRes, catRes, artRes] = await Promise.all([
          privateRequest.get("/user"),
          privateRequest.get("/quizzes"),
          privateRequest.get("/categories"),
          privateRequest.get("/articles"),
        ]);

        setStats({
          users: usersRes.data?.length || 0,
          quizzes:
            quizzesRes.data?.length || quizzesRes.data?.items?.length || 0,
          categories: catRes.data?.length || 0,
          articles: artRes.data?.length || artRes.data?.items?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Welcome back, here's what's happening Today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users.toLocaleString()}
          icon={UsersIcon}
          trend="up"
          trendValue="+12%"
          color="bg-indigo-600"
          loading={loading}
        />
        <StatCard
          title="Active Quizzes"
          value={stats.quizzes.toLocaleString()}
          icon={HelpCircle}
          trend="up"
          trendValue="+5.4%"
          color="bg-violet-600"
          loading={loading}
        />
        <StatCard
          title="Categories"
          value={stats.categories.toLocaleString()}
          icon={Layers}
          trend="up"
          trendValue="+2.1%"
          color="bg-pink-600"
          loading={loading}
        />
        <StatCard
          title="Blog Posts"
          value={stats.articles.toLocaleString()}
          icon={FileText}
          trend="up"
          trendValue="+18%"
          color="bg-amber-500"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                System Growth
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Monthly performance overview
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-violet-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Quizzes
                </span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorQuiz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    padding: "12px 16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="quiz"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorQuiz)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Content Distribution
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Resources by category
            </p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Articles", value: stats.articles || 10 },
                    { name: "Quizzes", value: stats.quizzes || 5 },
                    { name: "Categories", value: stats.categories || 5 },
                    { name: "Users", value: stats.users || 20 },
                  ]}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {[400, 300, 300, 200].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {["Articles", "Quizzes", "Categories", "Users"].map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                ></div>
                <span className="text-xs font-bold text-slate-600">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
