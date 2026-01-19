"use client";

import {
  HomeOutlined,
  PhoneOutlined,
  PlusOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Button, Divider, Rate, Spin, Tabs, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Product as ApiProduct, productService } from "../../../lib/services/product.service";
import { uploadService } from "../../../lib/services/upload.service";
import Container from "../../common/components/layouts/Container";
import { useCart } from "../../common/contexts/CartContext";

const ProductDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();

  const loadProduct = useCallback(async (slugValue: string) => {
    setLoading(true);
    console.log(slugValue);
    try {
      const response = await productService.getById(Number(slugValue));
      if (response.success && response.data) {
        const productData = response.data;
        setProduct(productData);

        // Load related products (same category)
        if (productData.category_id) {
          const relatedRes = await productService.getAll({
            categoryId: productData.category_id,
            page: 1,
            pageSize: 100,
          });
          if (relatedRes.success && relatedRes.data) {
            const related = relatedRes.data.data
              .filter((p: ApiProduct) => p.id !== productData.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!params.slug) return;
    loadProduct(params.slug);
  }, [params.slug, loadProduct]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleAddToCart = () => {
    console.log(product);
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: uploadService.getImageUrl(product.image),
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const productImages = useMemo(() => {
    if (!product?.images) return product?.image ? [product.image] : [];
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
    return product?.image ? [product.image] : [];
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <Link href="/products">
            <Button type="primary">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = productImages[selectedImage] || product.image;

  const discount = product.original_price
    ? Math.round(
      ((product.original_price - product.price) / product.original_price) * 100
    )
    : 0;

  const tabItems = [
    {
      key: "description",
      label: "Mô tả sản phẩm",
      children: (
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description || "Sản phẩm chất lượng cao từ Device Shop"}
          </p>
        </div>
      ),
    },
    {
      key: "warranty",
      label: "Chính sách & Bảo hành",
      children: (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <SafetyOutlined className="text-primary text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Chính sách bảo hành
              </h4>
              <p className="text-gray-700">
                Bảo hành chính hãng 12-24 tháng. Đổi mới trong 7 ngày đầu
                nếu có lỗi từ nhà sản xuất.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <TruckOutlined className="text-green-600 text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Chính sách giao hàng
              </h4>
              <p className="text-gray-700">
                Giao hàng toàn quốc. Miễn phí giao hàng trong nội thành.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

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
            <Link href="/products" className="hover:text-primary transition-colors">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </div>
        </Container>
      </div>

      {/* Product main info */}
      <div className="bg-white py-6 md:py-8">
        <Container className="px-3 md:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={uploadService.getImageUrl(mainImage)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{discount}%
                  </div>
                )}
              </div>
              {productImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image: string, index: number) => {
                    const isSelected = selectedImage === index;
                    const borderClass = isSelected
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-300";

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${borderClass} w-full`}
                      >
                        <Image
                          src={uploadService.getImageUrl(image)}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 20vw"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-4">
              <div>
                <Tag color="blue" className="mb-2">
                  {product.category?.name || 'Device Shop'}
                </Tag>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Rate disabled defaultValue={4.5} allowHalf />
                    <span className="text-sm text-gray-600">(4.5)</span>
                  </div>
                  <Divider type="vertical" className="h-4" />
                  <Tag color={product.stock > 0 ? "success" : "error"}>
                    {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                  </Tag>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Giá đã bao gồm VAT. Miễn phí giao hàng nội thành.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Bảo hành:</strong> 12-24 tháng chính hãng
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Giao hàng:</strong> 2-4 giờ (nội thành)
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Đổi trả:</strong> Trong 7 ngày nếu có lỗi
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="large"
                    icon={<PlusOutlined />}
                    className="h-12 text-base font-semibold"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="h-12 text-base font-semibold"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Mua ngay
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="large"
                    icon={<PhoneOutlined />}
                    className="h-12 text-sm md:text-base font-semibold"
                    href="tel:0387335333"
                  >
                    038 733 5333
                  </Button>
                  <Button
                    size="large"
                    icon={<PhoneOutlined />}
                    className="h-12 text-sm md:text-base font-semibold"
                    href="tel:0909309072"
                  >
                    090 930 9072
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Product details tabs */}
      <div className="bg-white py-6 md:py-8">
        <Container className="px-3 md:px-4">
          <Tabs
            defaultActiveKey="description"
            items={tabItems}
            size="large"
          />
        </Container>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 py-6 md:py-10">
          <Container className="px-3 md:px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={uploadService.getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-medium text-gray-800 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Rate disabled defaultValue={4.5} className="text-xs" />
                      <span className="text-xs text-gray-500">(4.5)</span>
                    </div>
                    <p className="text-primary font-bold text-base md:text-lg">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
