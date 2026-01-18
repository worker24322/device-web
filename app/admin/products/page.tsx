"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { Category as ApiCategory, categoryService } from "../../../lib/services/category.service";
import { Product as ApiProduct, productService } from "../../../lib/services/product.service";
import { uploadService } from "../../../lib/services/upload.service";

interface Product {
  key: string;
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  category_id?: number;
  stock: number;
  status: string;
  image: string;
  images?: string;
}

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [pagination.current, pagination.pageSize]);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      console.log('response', response);
      if (response.success && response.data) {
        const formatted = response.data.data.map((p: ApiProduct) => ({
          key: p.id.toString(),
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          category: p.category?.name || 'N/A',
          category_id: p.category_id,
          stock: p.stock,
          status: p.status,
          image: p.image,
          images: p.images,
        }));
        setProducts(formatted);
        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination.total_items || 0
        }));
      }
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
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
  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const showModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category_id: product.category_id,
        stock: product.stock,
        status: product.status,
      });
      
      // Load existing images
      if (product.images) {
        try {
          const urls = JSON.parse(product.images);
          setImageUrls(urls);
        } catch {
          setImageUrls([product.image]);
        }
      } else if (product.image) {
        setImageUrls([product.image]);
      }
    } else {
      setEditingProduct(null);
      form.resetFields();
      setImageUrls([]);
    }
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    setUploadLoading(true);
    try {
      const response = await uploadService.uploadSingleImage(file);
      if (response.success && response.data?.url) {
        setImageUrls(prev => [...prev, response.data!.url!]);
        message.success('Upload ảnh thành công!');
        onSuccess?.();
      } else {
        message.error(response.message || 'Upload thất bại!');
        onError?.();
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi upload!');
      onError?.();
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls(prev => prev.filter(u => u !== url));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const slug = values.name.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const productData = {
        name: values.name,
        slug: slug,
        description: values.description || '',
        price: values.price,
        original_price: values.originalPrice,
        category_id: values.category_id,
        stock: values.stock,
        status: values.status,
        image: imageUrls[0] || '/images/banner.webp',
        images: imageUrls.length > 0 ? JSON.stringify(imageUrls) : '',
      };

      if (editingProduct) {
        const response = await productService.update(editingProduct.id, productData);
        if (response.success) {
          message.success("Cập nhật sản phẩm thành công!");
          loadProducts();
        } else {
          message.error(response.message || "Cập nhật thất bại!");
        }
      } else {
        const response = await productService.create(productData);
        if (response.success) {
          message.success("Thêm sản phẩm thành công!");
          loadProducts();
        } else {
          message.error(response.message || "Thêm mới thất bại!");
        }
      }
      
      setIsModalOpen(false);
      form.resetFields();
      setEditingProduct(null);
      setImageUrls([]);
      setFileList([]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await productService.delete(id);
      if (response.success) {
        message.success("Xóa sản phẩm thành công!");
        loadProducts();
      } else {
        message.error(response.message || "Xóa thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image, record) => {
        const imageUrl = uploadService.getImageUrl(image);
        return <Image src={imageUrl} alt="Product" width={60} height={60} className="object-cover rounded" />;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 130,
      render: (value) => formatCurrency(value),
    },
    {
      title: "Giá gốc",
      dataIndex: "originalPrice",
      key: "originalPrice",
      width: 130,
      render: (value) => (value ? formatCurrency(value) : "-"),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock}
        </Tag>
      ),
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 120,
    //   render: (status) => {
    //     const statusMap: Record<string, { color: string; text: string }> = {
    //       active: { color: "green", text: "Đang bán" },
    //       out_of_stock: { color: "red", text: "Hết hàng" },
    //       inactive: { color: "gray", text: "Ngừng bán" },
    //     };
    //     console.log(status)
    //     return (
    //       <Tag color={statusMap[status]?.color}>{statusMap[status]?.text || status}</Tag>
    //     );
    //   },
    // },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      fixed: "right",
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
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        scroll={{ x: 1200 }}
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
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          setImageUrls([]);
        }}
        okText={editingProduct ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        width={700}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Camera Wifi 4K" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục" loading={categories.length === 0}>
              {categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh sản phẩm (Tối đa 4 hình)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={handleUpload}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              onRemove={(file) => {
                const index = fileList.findIndex(f => f.uid === file.uid);
                if (index >= 0 && imageUrls[index]) {
                  handleRemoveImage(imageUrls[index]);
                }
              }}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!');
                  return Upload.LIST_IGNORE;
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Ảnh phải nhỏ hơn 5MB!');
                  return Upload.LIST_IGNORE;
                }
                if (imageUrls.length >= 4) {
                  message.error('Tối đa 4 hình!');
                  return Upload.LIST_IGNORE;
                }
                return true;
              }}
              accept="image/*"
            >
              {imageUrls.length < 4 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            
            {imageUrls.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Đã upload: {imageUrls.length}/4 ảnh</p>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image 
                        src={uploadService.getImageUrl(url)} 
                        alt={`Product ${index + 1}`} 
                        width={80} 
                        height={80}
                        className="object-cover rounded border"
                      />
                      <Button
                        size="small"
                        danger
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                        onClick={() => handleRemoveImage(url)}
                      >
                        Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Giá bán"
              rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            >
              <InputNumber
                className="w-full"
                placeholder="1000000"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item name="originalPrice" label="Giá gốc">
              <InputNumber
                className="w-full"
                placeholder="1200000"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="stock"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber className="w-full" min={0} placeholder="100" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Select.Option value="active">Đang bán</Select.Option>
                <Select.Option value="out_of_stock">Hết hàng</Select.Option>
                <Select.Option value="inactive">Ngừng bán</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
