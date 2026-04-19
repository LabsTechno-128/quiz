"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { setAccessToken, setRefreshToken, setUser } from "../utils/helpers";
import { publicRequest } from "../config/axios.config";
import { Toastify } from "../components/ui/toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  }: any = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      console.log(data);
      const response = await publicRequest.post("auth/login", data);
      console.log(response);
      const resData = response.data;

      if (resData?.accessToken && resData?.refreshToken) {
        setAccessToken(resData.accessToken);
        setRefreshToken(resData.refreshToken);
        if (resData.user) {
          setUser(resData.user);
        }

        Toastify.Success("Login successful! Welcome back.");
        router.push("/dashboard");
      } else {
        Toastify.Error(resData?.message || "Login failed - Invalid response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Toastify.Error(
        error?.response?.data?.message ||
        "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            ThinkHive Admin
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 ${errors.email
                      ? "border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                    }`}
                  placeholder="admin@thinkhive.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500 pl-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Min length is 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={` text-black block w-full pl-10 pr-10 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 ${errors.password
                      ? "border-red-500"
                      : "border-slate-200 focus:border-indigo-500"
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500 pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-slate-600 cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Alternative Auth Option */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Need access? Contact your system administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          © 2026 ThinkHive. All rights reserved.
        </p>
      </div>
    </div>
  );
}
