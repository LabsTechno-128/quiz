import { clientApi } from '../lib/clientApi';
import type {
    Article,
    CreateArticleDto,
    UpdateArticleDto,
    PaginatedResponse,
    ArticleQueryParams,
} from '../types/api.types';

class ArticleService {
    private readonly BASE_PATH = 'articles';

    /**
     * Get all articles with pagination and filters
     */
    async getAll(params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.author) queryParams.append('author', params.author);

        const query = queryParams.toString();
        const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

        return clientApi.get(url);
    }

    /**
     * Get published articles only
     */
    async getPublished(params?: ArticleQueryParams): Promise<PaginatedResponse<Article>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);

        const query = queryParams.toString();
        const url = query ? `${this.BASE_PATH}/published?${query}` : `${this.BASE_PATH}/published`;

        return clientApi.get(url);
    }

    /**
     * Get a single article by ID
     */
    async getById(id: string): Promise<Article> {
        return clientApi.get(`${this.BASE_PATH}/${id}`);
    }

    /**
     * Get all article categories
     */
    async getCategories(): Promise<string[]> {
        return clientApi.get(`${this.BASE_PATH}/categories`);
    }

    /**
     * Create a new article (admin only)
     */
    async create(data: CreateArticleDto): Promise<Article> {
        return clientApi.post(this.BASE_PATH, data);
    }

    /**
     * Update an article (admin only)
     */
    async update(id: string, data: UpdateArticleDto): Promise<Article> {
        return clientApi.put(`${this.BASE_PATH}/${id}`, data);
    }

    /**
     * Delete an article (admin only)
     */
    async delete(id: string): Promise<void> {
        return clientApi.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const articleService = new ArticleService();
