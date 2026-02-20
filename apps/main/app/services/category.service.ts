import { clientApi } from '../lib/clientApi';
import type {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../types/api.types';

class CategoryService {
    private readonly BASE_PATH = 'categories';

    /**
     * Get all categories
     */
    async getAll(): Promise<Category[]> {
        return clientApi.get(this.BASE_PATH);
    }

    /**
     * Get a single category by ID
     */
    async getById(id: string): Promise<Category> {
        return clientApi.get(`${this.BASE_PATH}/${id}`);
    }

    /**
     * Create a new category (admin only)
     */
    async create(data: CreateCategoryDto): Promise<Category> {
        return clientApi.post(this.BASE_PATH, data);
    }

    /**
     * Update a category (admin only)
     */
    async update(id: string, data: UpdateCategoryDto): Promise<Category> {
        return clientApi.put(`${this.BASE_PATH}/${id}`, data);
    }

    /**
     * Delete a category (admin only)
     */
    async delete(id: string): Promise<void> {
        return clientApi.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const categoryService = new CategoryService();
