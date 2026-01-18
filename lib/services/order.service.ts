import { apiClient, ApiResponse } from '../api-client';

export interface OrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  total: number;
  status: string;
  payment_method: string;
  note?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  payment_method: string;
  note?: string;
  items: {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export const orderService = {
  async getAll(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<ApiResponse<{
    data: Order[];
    pagination: {
      current_page: number;
      page_size: number;
      total_items: number;
      total_pages: number;
      has_next: boolean;
      has_previous: boolean;
    };
  }>> {
    const { page = 1, pageSize = 10, status } = params || {};
    let endpoint = '/orders';
    const searchParams = new URLSearchParams();
    
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());
    if (status) searchParams.append('status', status);
    
    endpoint += `?${searchParams.toString()}`;
    
    return apiClient.get<{
      data: Order[];
      pagination: {
        current_page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
      };
    }>(endpoint, true);
  },

  async getById(id: number): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${id}`, true);
  },

  async create(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>('/orders', data);
  },

  async updateStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status }, true);
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/orders/${id}`, true);
  },
};

