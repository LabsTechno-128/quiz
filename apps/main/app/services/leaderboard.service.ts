import { clientApi } from "../lib/clientApi";
import type { User } from "../types/api.types";

// Define DTOs locally since they're not exported from api.types
interface CreateLeaderboardDto {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface UpdateLeaderboardDto {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

class LeaderboardService {
  private readonly BASE_PATH = "leaderboard";

  /**
   * Get all users (admin only)
   */
  async getAll(): Promise<User[]> {
    return clientApi.get(this.BASE_PATH);
  }

  async getUserRanking(): Promise<User> {
    return clientApi.get(`${this.BASE_PATH}/user`);
  }

   async getOverAllRanking(): Promise<{result:User[]}> {
    return clientApi.get(`${this.BASE_PATH}/overall`);
  }

  /**
   * Get a single user by ID
   */
  async getById(id: string): Promise<User> {
    return clientApi.get(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return clientApi.get(`${this.BASE_PATH}/me`);
  }

  /**
   * Create a new user (admin only)
   */
  async create(data: CreateLeaderboardDto): Promise<User> {
    return clientApi.post(this.BASE_PATH, data);
  }

  /**
   * Update user profile
   */
  async update(id: string, data: UpdateLeaderboardDto): Promise<User> {
    return clientApi.put(`${this.BASE_PATH}/${id}`, data);
  }

  /**
   * Delete a user (admin only)
   */
  async delete(id: string): Promise<void> {
    return clientApi.delete(`${this.BASE_PATH}/${id}`);
  }
}

export const leaderboardService = new  LeaderboardService();
