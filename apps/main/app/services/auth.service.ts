import { clientApi } from "../lib/clientApi";
import type {
  AuthResponse,
  LoginDto,
  SignupDto,
  User,
} from "../types/api.types";

class AuthService {
  private readonly TOKEN_KEY = "accessToken";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";

  /**
   * Sign up a new user
   */
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await clientApi.post("auth/signup", data);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await clientApi.post("auth/login", data);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Set authentication tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Initiate Google OAuth login
   */
  loginWithGoogle(): void {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/";
    window.location.href = `${apiUrl}auth/google`;
  }

  /**
   * Handle OAuth callback
   */
  handleOAuthCallback(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }
}

export const authService = new AuthService();
