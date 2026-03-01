"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/app/services/auth.service";
import { userService } from "@/app/services/user.service";
import type { User, LoginDto, SignupDto } from "@/app/types/api.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { email_or_phone: string }) => Promise<void>;
  signup: (data: SignupDto) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await userService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: { email_or_phone: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.loginWithPhoneOrEmail(data);
      // Fetch user profile after login
      console.log(response)
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const signup = async (data: SignupDto) => {
    setIsLoading(true);
    try {
      const response = await authService.signup(data);
      // Fetch user profile after signup
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
