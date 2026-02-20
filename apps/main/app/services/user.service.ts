import { clientApi } from '../lib/clientApi';
import type { User } from '../types/api.types';

// Define DTOs locally since they're not exported from api.types
interface CreateUserDto {
    email: string;
    password: string;
    name: string;
    firstName?: string;
    lastName?: string;
}

interface UpdateUserDto {
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}


class UserService {
    private readonly BASE_PATH = 'user';

    /**
     * Get all users (admin only)
     */
    async getAll(): Promise<User[]> {
        return clientApi.get(this.BASE_PATH);
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
    async create(data: CreateUserDto): Promise<User> {
        return clientApi.post(this.BASE_PATH, data);
    }

    /**
     * Update user profile
     */
    async update(id: string, data: UpdateUserDto): Promise<User> {
        return clientApi.put(`${this.BASE_PATH}/${id}`, data);
    }

    /**
     * Delete a user (admin only)
     */
    async delete(id: string): Promise<void> {
        return clientApi.delete(`${this.BASE_PATH}/${id}`);
    }
}

export const userService = new UserService();
