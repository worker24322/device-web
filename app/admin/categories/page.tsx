"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { categoryService, Category as ApiCategory } from "../../../lib/services/category.service";

interface Category {
  key: string;
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      if (response.success && response.data) {
        const formattedCategories = response.data.map((cat: ApiCategory) => ({
          key: cat.id.toString(),
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          productCount: cat.product_count,
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCategory) {
        // Update via API
        const response = await categoryService.update(editingCategory.id, values);
        if (response.success) {
          message.success("Cập nhật danh mục thành công!");
          loadCategories();
        } else {
          message.error(response.message || "Cập nhật thất bại!");
        }
      } else {
        // Create via API
        const response = await categoryService.create(values);
        if (response.success) {
          message.success("Thêm danh mục thành công!");
          loadCategories();
        } else {
          message.error(response.message || "Thêm mới thất bại!");
        }
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        message.success("Xóa danh mục thành công!");
        loadCategories();
      } else {
        message.error(response.message || "Xóa thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số sản phẩm",
      dataIndex: "productCount",
      key: "productCount",
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} loading={loading} />

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingCategory ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Camera An Ninh" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Vui lòng nhập slug" }]}
          >
            <Input placeholder="camera-an-ninh" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả danh mục..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;

