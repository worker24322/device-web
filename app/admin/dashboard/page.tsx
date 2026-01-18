"use client";

import { Order, orderService } from "@/lib/services/order.service";
import {
  OverviewStatistics,
  statisticsService
} from "@/lib/services/statistics.service";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Empty, Row, Spin, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [statistics, setStatistics] = useState<OverviewStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderService.getAll();
        if (response.success && response.data) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await statisticsService.getOverview();
        if (response.success && response.data) {
          console.log(response.data);
          setStatistics(response.data);
          // setRecentOrders(response.data.recent_orders || []);
        }
      } catch (error) {
        console.error("Failed to load statistics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "order_number",
      key: "orderNumber",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      key: "customer",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: "orange", text: "Chờ xử lý" },
          processing: { color: "blue", text: "Đang xử lý" },
          completed: { color: "green", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
        };
        return (
          <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      key: "date",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
  ];

  const statusSummary = statistics?.orders_by_status ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading && !statistics ? (
        <div className="flex justify-center items-center py-12">
          <Spin tip="Đang tải thống kê..." />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={statistics ? statistics.total_revenue : 0}
                  formatter={(value) => formatCurrency(Number(value))}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Đơn hàng"
                  value={statistics ? statistics.total_orders : 0}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Sản phẩm"
                  value={statistics ? statistics.total_products : 0}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Khách hàng"
                  value={statistics ? statistics.total_customers : 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24} lg={8}>
              <Card title="Đơn hàng theo trạng thái" className="shadow-sm">
                {statusSummary.length === 0 ? (
                  <Empty description="Chưa có dữ liệu" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {statusSummary.map((status) => {
                      const statusMap: Record<
                        string,
                        { color: string; text: string }
                      > = {
                        pending: { color: "orange", text: "Chờ xử lý" },
                        processing: { color: "blue", text: "Đang xử lý" },
                        shipping: { color: "cyan", text: "Đang giao" },
                        completed: { color: "green", text: "Hoàn thành" },
                        cancelled: { color: "red", text: "Đã hủy" },
                      };
                      const meta = statusMap[status.status] ?? {
                        color: "default",
                        text: status.status,
                      };
                      return (
                        <Tag key={status.status} color={meta.color}>
                          {meta.text}: {status.count}
                        </Tag>
                      );
                    })}
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="Đơn hàng gần đây" className="shadow-sm">
                <Table
                  columns={columns}
                  dataSource={orders}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty description="Không có đơn hàng gần đây" />
                    ),
                  }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="Hiệu suất doanh thu" className="shadow-sm">
            <p className="text-gray-600">
              Biểu đồ doanh thu theo tháng sẽ được bổ sung trong giai đoạn tiếp
              theo. Tạm thời bạn có thể xem doanh thu tổng ở mục trên và tải dữ
              liệu chi tiết từ API `/api/statistics`.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
