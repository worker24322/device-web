"use client";
import React, { useState } from "react";
import { Form, Input, Button, Radio, Card, Divider, Empty, message } from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "../common/components/layouts/Container";
import { useCart } from "../common/contexts/CartContext";
import { orderService } from "../../lib/services/order.service";
import { uploadService } from "../../lib/services/upload.service";

const CheckoutPage = () => {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const orderData = {
        customer_name: values.fullName,
        customer_phone: values.phone,
        customer_email: values.email,
        customer_address: values.address,
        payment_method: paymentMethod,
        note: values.note || '',
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await orderService.create(orderData);
      
      if (response.success && response.data) {
        message.success(`Đặt hàng thành công! Mã đơn: \${response.data.order_number}`);
        clearCart();
        router.push("/");
      } else {
        message.error(response.message || "Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      message.error("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <Container className="px-3 md:px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Empty
              description="Giỏ hàng trống"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link href="/products">
                <Button type="primary" size="large">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </Empty>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-8">
      <Container className="px-3 md:px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Thanh toán
          </h1>
          <p className="text-gray-600 mt-2">
            Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin đặt hàng */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin người nhận
              </h2>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input size="large" placeholder="Nguyễn Văn A" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="0912345678" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input size="large" placeholder="email@example.com" />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Địa chỉ nhận hàng"
                  name="address"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input.TextArea
                    size="large"
                    rows={3}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </Form.Item>

                <Form.Item
                  label="Ghi chú đơn hàng (không bắt buộc)"
                  name="note"
                >
                  <Input.TextArea
                    size="large"
                    rows={3}
                    placeholder="Ghi chú về đơn hàng..."
                  />
                </Form.Item>

                <Divider />

                <h2 className="text-xl font-semibold mb-4">
                  Phương thức thanh toán
                </h2>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    <Radio value="COD" className="w-full">
                      <div className="flex items-center gap-2">
                        <CheckCircleOutlined className="text-primary" />
                        <span className="font-medium">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6 mt-1">
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </p>
                    </Radio>
                    <Radio value="bank" className="w-full">
                      <div className="flex items-center gap-2">
                        <CheckCircleOutlined className="text-primary" />
                        <span className="font-medium">
                          Chuyển khoản ngân hàng
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6 mt-1">
                        Chuyển khoản qua ngân hàng
                      </p>
                    </Radio>
                  </div>
                </Radio.Group>
              </Form>
            </Card>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCartOutlined />
                Đơn hàng của bạn
              </h2>

              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={uploadService.getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        SL: {item.quantity}
                      </p>
                      <p className="text-primary font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromCart(item.id)}
                    />
                  </div>
                ))}
              </div>

              <Divider />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-medium">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
              </div>

              <Divider />

              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Tổng cộng:</span>
                <span className="text-primary text-xl">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>

              <Button
                type="primary"
                size="large"
                className="w-full h-12 text-base font-semibold"
                onClick={() => form.submit()}
                loading={submitting}
              >
                Đặt hàng
              </Button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <CheckCircleOutlined className="text-primary mr-2" />
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản của chúng tôi
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
