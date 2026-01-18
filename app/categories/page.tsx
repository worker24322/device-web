"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Spin, Empty } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import Container from "../common/components/layouts/Container";
import { categoryService, Category as ApiCategory } from "../../lib/services/category.service";

const CategoriesPage = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải danh mục..." />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <Container className="px-3 md:px-4">
          <div className="py-3 flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <HomeOutlined />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Danh mục sản phẩm</span>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <div className="py-6 md:py-10">
        <Container className="px-3 md:px-4">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Danh mục sản phẩm
            </h1>
            <p className="text-gray-600">
              Khám phá các danh mục sản phẩm của chúng tôi
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Empty
                description="Chưa có danh mục nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="block"
                >
                  <Card
                    hoverable
                    className="border border-gray-200 rounded-lg overflow-hidden h-full transition-all hover:shadow-lg"
                  >
                    <div className="text-center space-y-4">
                      {/* Category name */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                        {category.name}
                      </h3>

                      {/* Description */}
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                          {category.description}
                        </p>
                      )}

                      {/* Product count */}
                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-100">
                        <ShoppingOutlined className="text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {category.product_count || 0} sản phẩm
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default CategoriesPage;

