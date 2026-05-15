import { clientApi } from "../lib/clientApi";
import type { CreateAnswerDto } from "../types/api.types";

class AnswerService {
  private readonly BASE_PATH = "answers";

  /**
   * Submit quiz answers
   */
  async create(data: CreateAnswerDto): Promise<any> {
    return clientApi.post(this.BASE_PATH, data);
  }

  /**
   * Get leaderboard for a specific quiz
   */
  async getLeaderboard(quizId: string): Promise<any[]> {
    return clientApi.get(`${this.BASE_PATH}/leaderboard/${quizId}`);
  }

  /**
   * Get current user's quiz submissions
   */
  async getMySubmissions(): Promise<any[]> {
    return clientApi.get(`${this.BASE_PATH}/my-submissions`);
  }

  /**
   * Get single submission by ID
   */
  async getById(id: string): Promise<any> {
    return clientApi.get(`${this.BASE_PATH}/${id}`);
  }
}

export const answerService = new AnswerService();
