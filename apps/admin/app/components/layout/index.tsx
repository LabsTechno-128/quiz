"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { getAccessToken, getUser } from "@/app/utils/helpers";

type userData = {
  name: string;
  email: string;
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState<userData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const token = getAccessToken();
    const user = getUser();
    setUserData(user);

    if (!token && pathname !== "/login") {
      router.push("/login");
    }
    if (token && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  if (!isMounted) return null;

  // If it's the login page, don't show the sidebar/layout
  if (pathname === "/login") {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-40">
          <div className="flex items-center gap-4  justify-end">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors lg:hidden  "
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 w-64 lg:w-96 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2.5 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
              {/* <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors lg:hidden"
              >
                <Menu className="h-6 w-6" />sdfdsf
              </button> */}
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {userData?.name || "Admin User"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {userData?.email || "admin@thinkhive.com"}
                  </p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-2xl shadow-indigo-500/10 border border-slate-100 p-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      User Profile
                    </p>
                  </div>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                  <div className="h-[1px] bg-slate-50 my-2"></div>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main
          className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8"
          onClick={() => setIsSidebarOpen(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
