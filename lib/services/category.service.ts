import { apiClient, ApiResponse } from '../api-client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name: string;
  slug: string;
  description: string;
}

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/categories');
  },

  async getById(id: number): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/categories/slug/${slug}`);
  },

  async create(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiClient.post<Category>('/categories', data, true);
  },

  async update(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return apiClient.put<Category>(`/categories/${id}`, data, true);
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/categories/${id}`, true);
  },
};

