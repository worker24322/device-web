"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Button, Rate } from "antd";
import { ArrowRightOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Container from "./layouts/Container";
import { useCart } from "../contexts/CartContext";
import { uploadService } from "../../../lib/services/upload.service";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
}

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

const ProductsSection = ({ title, subtitle, products }: ProductsSectionProps) => {
  const { addToCart } = useCart();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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

  return (
    <div className="py-4 md:py-6 lg:py-8 bg-gray-50">
      <Container className="px-3 md:px-4">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2">
            {title}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {subtitle && (
              <p className="text-sm md:text-base text-gray-600 flex-1">
                {subtitle}
              </p>
            )}
            <Link
              href="/products"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold text-sm md:text-base transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Xem thêm
              <ArrowRightOutlined className="text-base" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              hoverable
              className="border border-gray-200 rounded-lg overflow-hidden"
              cover={
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full h-40 md:h-48 bg-gray-100">
                    <Image
                      src={uploadService.getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </Link>
              }
              actions={[]}
            >
              <div className="min-h-[100px] md:min-h-[120px]">
                <h3 className="font-semibold text-gray-800 mb-2 overflow-hidden text-ellipsis line-clamp-2 text-sm md:text-base" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.name}
                </h3>
                <div className="flex items-center mb-2">
                  <Rate
                    disabled
                    defaultValue={5}
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="mt-2 md:mt-3">
                  <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
                    <span className="text-base md:text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs md:text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <Button
                  type="default"
                  size="middle"
                  icon={<ShoppingCartOutlined />}
                  onClick={(e) => handleAddToCart(product, e)}
                  className="flex-1 text-xs md:text-sm"
                >
                  Thêm
                </Button>
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button
                    type="primary"
                    size="middle"
                    className="w-full text-xs md:text-sm"
                  >
                    Mua ngay
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ProductsSection;
