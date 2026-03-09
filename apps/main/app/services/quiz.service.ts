import { clientApi } from "../lib/clientApi";
import type {
  Quiz,
  CreateQuizDto,
  UpdateQuizDto,
  PaginatedResponse,
  PaginationParams,
} from "../types/api.types";

class QuizService {
  private readonly BASE_PATH = "quiz";

  /**
   * Get all quizzes with pagination
   */
  async getAll(
    params?: PaginationParams & { includeRelations?: boolean },
  ): Promise<PaginatedResponse<Quiz>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.includeRelations)
      queryParams.append("includeRelations", "true");

    const query = queryParams.toString();
    const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

    return clientApi.get(url);
  }

  /**
   * Get a single quiz by ID
   */
  async getById(id: string, includeQuestions = false): Promise<{result: Quiz}> {
    const url = includeQuestions
      ? `${this.BASE_PATH}/${id}?includeRelations=true`
      : `${this.BASE_PATH}/${id}`;
    return clientApi.get(url);
  }

  /**
   * Create a new quiz (admin only)
   */
  async create(data: CreateQuizDto): Promise<Quiz> {
    return clientApi.post(this.BASE_PATH, data);
  }

  /**
   * Update a quiz (admin only)
   */
  async update(id: string, data: UpdateQuizDto): Promise<Quiz> {
    return clientApi.put(`${this.BASE_PATH}/${id}`, data);
  }

  /**
   * Delete a quiz (admin only)
   */
  async delete(id: string): Promise<void> {
    return clientApi.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get quizzes by category
   */
  async getByCategory(
    categoryId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Quiz>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return clientApi.get(`${this.BASE_PATH}/category/${categoryId}?${queryParams.toString()}`);
  }
}

export const quizService = new QuizService();
