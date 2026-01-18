"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAdminAuth } from "../../common/contexts/AdminAuthContext";

const REMEMBER_ME_KEY = "admin_remember_me";
const SAVED_CREDENTIALS_KEY = "admin_saved_credentials";

const AdminLoginPage = () => {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();

  // Load saved credentials on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      if (rememberMe) {
        const savedCredentials = localStorage.getItem(SAVED_CREDENTIALS_KEY);
        if (savedCredentials) {
          try {
            const { username, password } = JSON.parse(savedCredentials);
            form.setFieldsValue({ username, password, remember: true });
          } catch (error) {
            console.error('Failed to load saved credentials:', error);
          }
        }
      }
    }
  }, [form]);

  const onFinish = async (values: { username: string; password: string; remember?: boolean }) => {
    setLoading(true);
    try {
      // Call API with email instead of username
      const success = await login(values.username, values.password);
      if (success) {
        // Handle remember me
        if (values.remember) {
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
          localStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify({
            username: values.username,
            password: values.password
          }));
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
          localStorage.removeItem(SAVED_CREDENTIALS_KEY);
        }
        
        message.success("Đăng nhập thành công!");
        router.replace("/admin/dashboard");
      } else {
        message.error("Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Vạn Lộc Infotech</h1>
          <p className="text-gray-600">Đăng nhập quản trị</p>
        </div>

        <Form
          form={form}
          name="admin-login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-base font-semibold"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 font-medium mb-2">Thông tin đăng nhập demo:</p>
          <p className="text-sm text-gray-600">Email: <span className="font-mono font-semibold">admin@device-shop.com</span></p>
          <p className="text-sm text-gray-600">Password: <span className="font-mono font-semibold">admin123456</span></p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;

