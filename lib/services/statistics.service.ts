import { apiClient, ApiResponse } from "../api-client";

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface OverviewStatistics {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  orders_by_status: OrderStatusCount[];
  revenue_by_month: MonthlyRevenue[];
  recent_orders: RecentOrder[];
}

export const statisticsService = {
  async getOverview(): Promise<ApiResponse<OverviewStatistics>> {
    return apiClient.get<OverviewStatistics>("/statistics", true);
  },
};


