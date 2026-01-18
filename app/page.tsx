"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import Container from "./common/components/layouts/Container";
import CategorySidebar from "./common/components/CategorySidebar";
import Banner from "./common/components/Banner";
import ProductsSection from "./common/components/ProductsSection";
import { CheckCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { BANNER_IMAGES } from "./common/constants/image";
import { productService, Product as ApiProduct } from "../lib/services/product.service";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      if (response.success && response.data) {
        const allProducts = response.data.data;
        
        // Featured products: first 8
        const featured = allProducts.slice(0, 8).map((p: ApiProduct) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          rating: 4.5,
        }));
        
        // New products: last 8 or random 8
        const newProds = allProducts.slice(-8).map((p: ApiProduct) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          rating: 4.6,
        }));
        
        setFeaturedProducts(featured);
        setNewProducts(newProds);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className="w-full">
      {/* Danh mục sản phẩm header */}
      <div className="w-full bg-primary">
        <Container className="px-3 md:px-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center">
            <div className="w-full md:w-64">
              <div className="p-3 md:p-4 text-white font-semibold flex items-center gap-2">
                <MenuOutlined />
                <span className="text-sm md:text-base">DANH MỤC SẢN PHẨM</span>
              </div>
            </div>
            <nav className="flex-1 flex items-center gap-3 md:gap-6 px-3 md:px-0 pb-3 md:pb-0 overflow-x-auto">
              <Link
                href="/products"
                className="text-white hover:text-gray-200 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Sản phẩm
              </Link>
              <Link
                href="/categories"
                className="text-white hover:text-gray-200 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Danh mục
              </Link>
            </nav>
          </div>
        </Container>
      </div>

      {/* Banner và Sidebar */}
      <div className="bg-gray-50 py-2 md:py-4">
        <Container className="px-3 md:px-4">
          <div className="flex flex-col lg:flex-row gap-2 md:gap-4">
            <div className="hidden lg:block">
              <CategorySidebar />
            </div>
            <div className="flex-1">
              <Banner src={BANNER_IMAGES.HOME} alt="Banner chính" />
            </div>
          </div>
        </Container>
      </div>

      {/* Sản phẩm nổi bật */}
      {!loading && featuredProducts.length > 0 && (
        <ProductsSection
          title="SẢN PHẨM NỔI BẬT"
          subtitle="Khám phá các sản phẩm công nghệ chất lượng cao"
          products={featuredProducts}
        />
      )}

      {/* Banner giữa */}
      <div className="bg-white py-4 md:py-6">
        <Container className="px-3 md:px-4">
          <Banner src={BANNER_IMAGES.MIDDLE} alt="Banner giữa" />
        </Container>
      </div>

      {/* Sản phẩm mới */}
      {!loading && newProducts.length > 0 && (
        <ProductsSection
          title="SẢN PHẨM MỚI"
          subtitle="Những sản phẩm mới nhất được cập nhật"
          products={newProducts}
        />
      )}

  </div>
);
};

export default Home;
