"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DownOutlined } from "@ant-design/icons";
import { categoryService, Category } from "../../../lib/services/category.service";

const CategoryDropdownMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      console.log('Loading categories...');
      const response = await categoryService.getHierarchy();
      console.log('Categories response:', response);
      if (response.success && response.data) {
        setCategories(response.data);
        console.log('Categories loaded:', response.data.length);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-primary text-white p-3">
        <div className="text-gray-300">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-6 py-3">
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              {/* Main category */}
              <Link
                href={`/products?category_id=${category.id}`}
                className="flex items-center gap-1 text-white hover:text-gray-200 font-medium transition-colors text-sm md:text-base whitespace-nowrap py-1"
              >
                <span>{category.name}</span>
                {category.children && category.children.length > 0 && (
                  <DownOutlined className="text-xs transition-transform duration-200 group-hover:rotate-180" />
                )}
              </Link>

              {/* Horizontal submenu - hiển thị bên cạnh */}
              {category.children && category.children.length > 0 && (
                <div className="absolute top-0 left-full ml-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                  <div className="py-2">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/products?category_id=${child.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span>{child.name}</span>
                          {child.product_count > 0 && (
                            <span className="text-xs text-gray-400">({child.product_count})</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdownMenu;
