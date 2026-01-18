import { apiClient, ApiResponse } from '../api-client';
import { Category } from './category.service';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: number;
  stock: number;
  status: string;
  image: string;
  images?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: number;
  stock: number;
  status: string;
  image: string;
  images?: string;
}

export interface UpdateProductRequest {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: number;
  stock: number;
  status: string;
  image: string;
  images?: string;
}

export const productService = {
  async getAll(
    params?: {
      categoryId?: number;
      status?: string;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      search?: string;
    }
  ): Promise<ApiResponse<{
    data: Product[];
    pagination: {
      current_page: number;
      page_size: number;
      total_items: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  }>> {
    const { categoryId, status, page = 1, pageSize = 10, sortBy, search } = params || {};
    let endpoint = '/products';
    const searchParams = new URLSearchParams();

    if (categoryId) searchParams.append('category_id', categoryId.toString());
    if (status) searchParams.append('status', status);
    if (search) searchParams.append('search', search);
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());
    if (sortBy) searchParams.append('sortBy', sortBy);

    endpoint += `?${searchParams.toString()}`;

    return apiClient.get<{
      data: Product[];
      pagination: {
        current_page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
      };
    }>(endpoint);
  },

  async getById(id: number): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/slug/${slug}`);
  },

  async create(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', data, true);
  },

  async update(id: number, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, data, true);
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`, true);
  },
};

