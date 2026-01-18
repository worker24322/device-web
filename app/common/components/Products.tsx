"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, Button, Rate, Spin } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Container from "./layouts/Container";
import { productService, Product as ApiProduct } from "../../../lib/services/product.service";
import { uploadService } from "../../../lib/services/upload.service";
import { useCart } from "../contexts/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      if (response.success && response.data) {
        const formatted = response.data.data.slice(0, 8).map((p: ApiProduct) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          rating: 4.5,
        }));
        setProducts(formatted);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: uploadService.getImageUrl(product.image),
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="py-8 bg-gray-50">
        <Container>
          <div className="text-center py-12">
            <Spin size="large" tip="Đang tải sản phẩm..." />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            SẢN PHẨM NỔI BẬT
          </h2>
          <p className="text-gray-600">
            Khám phá các sản phẩm công nghệ chất lượng cao
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              hoverable
              className="border border-gray-200 rounded-lg overflow-hidden"
              cover={
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={uploadService.getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </Link>
              }
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  className="w-full"
                  key="buy"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Thêm vào giỏ
                </Button>,
              ]}
            >
              <div className="min-h-[120px]">
                <h3 className="font-semibold text-gray-800 mb-2 overflow-hidden text-ellipsis line-clamp-2" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.name}
                </h3>
                <div className="flex items-center mb-2">
                  <Rate
                    disabled
                    defaultValue={product.rating}
                    className="text-sm"
                  />
                  <span className="ml-2 text-xs text-gray-500">
                    ({product.rating})
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="mt-1">
                      <span className="text-xs text-red-500 font-semibold">
                        Giảm{" "}
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Products;
