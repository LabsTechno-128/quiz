import { clientApi } from "../lib/clientApi";
import type {
    Product,
    PaginatedResponse,
    PaginationParams,
} from "../types/api.types";

class ProductService {
    private readonly BASE_PATH = "products";

    /**
     * Get all products with pagination and filters
     */
    async getAll(
        params?: PaginationParams & { 
            categoryId?: string; 
            categorySlug?: string; 
            type?: string;
        },
    ): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
        if (params?.categorySlug) queryParams.append("categorySlug", params.categorySlug);
        if (params?.type) queryParams.append("type", params.type);

        const query = queryParams.toString();
        const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

        return clientApi.get(url);
    }

    /**
     * Get a single product by ID
     */
    async getById(id: string): Promise<{ result: Product }> {
        return clientApi.get(`${this.BASE_PATH}/${id}`);
    }

    /**
     * Get products by category slug
     */
    async getByCategorySlug(
        slug: string,
        params?: PaginationParams,
    ): Promise<PaginatedResponse<Product>> {
        return this.getAll({ ...params, categorySlug: slug });
    }
}

export const productService = new ProductService();
