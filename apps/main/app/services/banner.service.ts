import { clientApi } from '../lib/clientApi';
import type {
    Banner,
    CreateBannerDto,
    UpdateBannerDto,
    PaginatedResponse,
    PaginationParams,
} from '../types/api.types';

class BannerService {
    private readonly BASE_PATH = 'banners';

    /**
     * Get all banners with pagination
     */
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Banner>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);

        const query = queryParams.toString();
        const url = query ? `${this.BASE_PATH}?${query}` : this.BASE_PATH;

        return clientApi.get(url);
    }

    /**
     * Get active banners only
     */
    async getActive(): Promise<Banner[]> {
        const response = await this.getAll({ limit: 100 });
        // Filter active banners on client side
        return (response.result || []).filter(banner => banner.isActive);
    }

    /**
     * Get a single banner by ID
     */
    async getById(id: string): Promise<Banner> {
        return clientApi.get(`${this.BASE_PATH}/${id}`);
    }

    /**
     * Create a new banner (admin only)
     */
    async create(data: CreateBannerDto): Promise<Banner> {
        return clientApi.post(this.BASE_PATH, data);
    }

    /**
     * Upload banner image (admin only)
     */
    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        // Note: This requires special handling for multipart/form-data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${this.BASE_PATH}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        return response.json();
    }

    /**
     * Update a banner (admin only)
     */
    async update(id: string, data: UpdateBannerDto): Promise<Banner> {
        return clientApi.put(`${this.BASE_PATH}/${id}`, data);
    }

    /**
     * Delete a banner (admin only)
     */
    async delete(id: string): Promise<void> {
        return clientApi.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const bannerService = new BannerService();
