"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { publicRequest } from "@/app/lib/axios";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function isEmail(value: string) {
    return /\S+@\S+\.\S+/.test(value);
  }

  function isPhone(value: string) {
    return /^[0-9]{8,15}$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // if (isEmail(identifier)) {
    //   setError("Please use phone number to login.");
    //   return;
    // }

    // if (!isPhone(identifier)) {
    //   setError("Invalid phone number.");
    //   return;
    // }

    try {
      setLoading(true);

      //   await publicRequest.post("/auth/login", {
      //     email_or_phone: identifier,
      //   });
      if (!identifier || identifier.length < 8) {
        setError("Please enter a valid phone number or email.");
        return;
      }
      await login({
        email_or_phone: identifier,
      });
      onClose();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl animate-in fade-in zoom-in-95">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 text-center">
          Welcome Back
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Phone or Email
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}