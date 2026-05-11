import { clientApi } from "../lib/clientApi";
import type {
  Ebook,
  EbookResponseDto,
  CreateEbookDto,
  UpdateEbookDto,
  PaginationParams,
} from "../types/api.types";

class EbookService {
  private readonly BASE_PATH = "ebooks";

  /**
   * Get all ebooks with pagination
   */
  async getAll(params?: PaginationParams): Promise<{
    data: EbookResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

    return clientApi.get(url);
  }

  /**
   * Get a single ebook by ID
   */
  async getById(id: string): Promise<EbookResponseDto> {
    return clientApi.get(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Create a new ebook (admin only)
   */
  async create(data: CreateEbookDto): Promise<EbookResponseDto> {
    return clientApi.post(this.BASE_PATH, data);
  }

  /**
   * Update an ebook (admin only)
   */
  async update(id: string, data: UpdateEbookDto): Promise<EbookResponseDto> {
    return clientApi.put(`${this.BASE_PATH}/${id}`, data);
  }

  /**
   * Delete an ebook (admin only)
   */
  async delete(id: string): Promise<void> {
    return clientApi.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Get purchased ebooks for current user
   */
  async getMyEbooks(): Promise<any[]> {
    return clientApi.get(`${this.BASE_PATH}/my-ebooks`);
  }
}

export const ebookService = new EbookService();
