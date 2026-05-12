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
  Package,
  DollarSign,
  ShoppingCart,
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
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [statsRes, salesRes, distRes] = await Promise.all([
          privateRequest.get("/analytics/dashboard-stats"),
          privateRequest.get("/analytics/sales-report"),
          privateRequest.get("/analytics/category-distribution"),
        ]);

        setStats(statsRes.data);
        setSalesData(salesRes.data);
        setDistribution(distRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ecommerce Analytics
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Overview of your store's performance and growth.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Current Year
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={loading ? "..." : `$${(stats?.totalSales || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+24%"
          color="bg-rose-500"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : (stats?.totalOrders || 0).toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="+12%"
          color="bg-amber-500"
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={loading ? "..." : (stats?.totalProducts || 0).toLocaleString()}
          icon={Package}
          trend="up"
          trendValue="+5.4%"
          color="bg-emerald-600"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={loading ? "..." : (stats?.totalUsers || 0).toLocaleString()}
          icon={UsersIcon}
          trend="up"
          trendValue="+18%"
          color="bg-indigo-600"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Sales Growth Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Sales Growth
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                Revenue overview for the current year
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Revenue
                </span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Product Distribution
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Inventory by category
            </p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
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
          <div className="grid grid-cols-2 gap-3 mt-8">
            {distribution.slice(0, 4).map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></div>
                <span className="text-[10px] font-bold text-slate-600 truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
