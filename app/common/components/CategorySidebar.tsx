"use client";

import { Menu } from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import { categoryService, Category } from "../../../lib/services/category.service";

const CategorySidebar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
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



  const menuItems = categories.map(cat => ({
    key: cat.id.toString(),
    label: (
      <Link href={`/products?category_id=${cat.id}`}>
        <span>{cat.name}</span>
        {cat.product_count > 0 && (
          <span className="text-xs text-gray-400 ml-2">({cat.product_count})</span>
        )}
      </Link>
    ),
  }));

  if (loading) {
    return (
      <div className="bg-white border-r border-gray-200 w-64 p-4">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border-r border-gray-200 w-64">
      <Menu
        mode="inline"
        className="border-0"
        items={menuItems}
      />
    </div>
  );
};

export default CategorySidebar;
