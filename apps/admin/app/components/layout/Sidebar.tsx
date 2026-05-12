"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FileText,
  HelpCircle,
  User,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUser, removeToken } from "@/app/utils/helpers";
import { Toastify } from "../ui/toastify";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Categories", href: "/category", icon: Layers },
  { name: "Product", href: "/product", icon: FileText },
  { name: "Banners", href: "/banner", icon: Layers },
  { name: "Quiz", href: "/quiz", icon: HelpCircle },
  { name: "Questions", href: "/question", icon: HelpCircle },
  { name: "Blogs", href: "/article", icon: FileText },
  { name: "Users", href: "/users", icon: Users },
];

export default function Sidebar({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setUserData(getUser());
  }, []);

  const handleLogout = () => {
    removeToken();
    Toastify.Success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex h-full w-64 flex-col bg-[#0f172a] text-slate-300 shadow-2xl transition-all duration-300">
      {/* Brand Section */}
      <div className="flex bg-[#1e293b] h-20 items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
          <Layers className="h-6 w-6 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
            ThinkHive
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-6 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-1">
        <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "hover:bg-slate-800 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-4 space-y-4">
        <div className="rounded-2xl bg-[#1e293b] p-4 text-center">
          <div className="relative mx-auto mb-3 h-12 w-12 cursor-pointer group">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 scale-0 group-hover:scale-125 transition-transform duration-300"></div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin"
              className="h-full w-full rounded-full ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1e293b] bg-green-500"></div>
          </div>
          <p className="text-sm font-bold text-white">
            {userData?.name || "Admin User"}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {userData?.email || "admin@thinkhive.com"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 transition-colors group-hover:bg-red-500/20">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
