"use client";

import { EyeOutlined } from "@ant-design/icons";
import {
    Button,
    Descriptions,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Order as ApiOrder, orderService } from "../../../lib/services/order.service";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  key: string;
  id: number;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  date: string;
  note?: string;
}

const OrdersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadOrders();
  }, [pagination.current, pagination.pageSize]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (response.success && response.data) {
        const formatted = response.data.data.map((o: ApiOrder) => ({
          key: o.id.toString(),
          id: o.id,
          orderNumber: o.order_number,
          customer: {
            name: o.customer_name,
            phone: o.customer_phone,
            email: o.customer_email || '',
            address: o.customer_address,
          },
          items: o.items?.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price,
          })) || [],
          total: o.total,
          status: o.status,
          paymentMethod: o.payment_method,
          date: new Date(o.created_at).toLocaleString('vi-VN'),
          note: o.note,
        }));
        setOrders(formatted);
        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination.total_items || 0
        }));
      }
    } catch (error) {
      console.log(error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await orderService.updateStatus(orderId, newStatus);
      if (response.success) {
        message.success("Cập nhật trạng thái thành công!");
        loadOrders();
      } else {
        message.error(response.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 100,
    },
    {
      title: "Khách hàng",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customer.name}</div>
          <div className="text-gray-500 text-sm">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (value) => (
        <span className="font-semibold text-primary">{formatCurrency(value)}</span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
      render: (method) => (
        <Tag color={method === "COD" ? "orange" : "blue"}>
          {method === "COD" ? "COD" : "Chuyển khoản"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          options={statusOptions}
          style={{ width: "100%" }}
          size="small"
        />
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showOrderDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
        <Space>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            allowClear
            options={[
              { value: "all", label: "Tất cả" },
              ...statusOptions,
            ]}
            onChange={(value) => {
              // TODO: Filter orders by status
            }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        scroll={{ x: 1000 }}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.orderNumber}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Thông tin khách hàng" column={1} bordered>
              <Descriptions.Item label="Họ tên">
                {selectedOrder.customer.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.customer.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.customer.address}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Chi tiết đơn hàng" column={1} bordered className="mt-4">
              <Descriptions.Item label="Mã đơn hàng">
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {selectedOrder.date}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
              </Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú">
                  {selectedOrder.note}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="mt-4">
              <h3 className="font-semibold mb-3">Sản phẩm</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Tên sản phẩm</th>
                    <th className="border p-2 text-center">Số lượng</th>
                    <th className="border p-2 text-right">Đơn giá</th>
                    <th className="border p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-center">{item.quantity}</td>
                      <td className="border p-2 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="border p-2 text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={3} className="border p-2 text-right">
                      Tổng cộng:
                    </td>
                    <td className="border p-2 text-right text-primary text-lg">
                      {formatCurrency(selectedOrder.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
