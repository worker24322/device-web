"use client";

import { Category, categoryService } from "@/lib/services/category.service";
import { Product as ApiProduct, productService } from "@/lib/services/product.service";
import { Card, Col, Pagination, Radio, Row, Select, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const { Option } = Select;

const ProductsPage = () => {
  // States
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('category_id');
  const searchQueryParam = searchParams.get('search');

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState({
    categories: categoryIdParam ? [Number(categoryIdParam)] : [] as number[],
  });
  const [sortBy, setSortBy] = useState("DESC");
  const [searchQuery, setSearchQuery] = useState(searchQueryParam || "");

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(sortBy);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({
          page: pagination.current,
          pageSize: pagination.pageSize,
          categoryId: filters.categories.length ? filters.categories[0] : undefined,
          sortBy: sortBy,
          search: searchQuery || undefined,
        }),
        categoryService.getAll(),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.data);
        setPagination(prev => ({
          ...prev,
          total: productsRes.data?.pagination.total_items || 0
        }));
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId: number | null) => {
    setFilters(prev => ({ ...prev, categories: categoryId ? [categoryId] : [] }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  // Sync filters with URL params
  useEffect(() => {
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');
    
    if (categoryId) {
      const id = Number(categoryId);
      if (!isNaN(id)) {
        setFilters(prev => {
           // Skip if already set to avoid loop/redundant updates
           if (prev.categories.includes(id) && prev.categories.length === 1) return prev;
           return { ...prev, categories: [id] };
        });
        setPagination(prev => ({ ...prev, current: 1 }));
      }
    }
    
    if (search !== null) {
      setSearchQuery(search);
      setPagination(prev => ({ ...prev, current: 1 }));
    }
  }, [searchParams]);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchData();
  }, [filters, pagination.current, pagination.pageSize, sortBy, searchQuery]);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm cho: "{searchQuery}"
            </h2>
            <p className="text-gray-600 mt-1">
              Tìm thấy {pagination.total} sản phẩm
            </p>
          </div>
        )}
        <div className="flex justify-end mb-6">
          <Select
            // value={sortBy}
            style={{ width: 200 }}
            onChange={handleSortChange}
            size="large"
            placeholder="Sắp xếp"
          >
            <Option value="ASC">Mới nhất</Option>
            <Option value="DESC">Cũ nhất</Option>
          </Select>
        </div>

        <Row gutter={[24, 24]}>
          {/* Categories Filter */}
          <Col xs={24} md={6}>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
              <Radio.Group
                className="flex flex-col gap-2"
                onChange={(e) => handleCategoryChange(e.target.value)}
                value={filters.categories.length > 0 ? filters.categories[0] : null}
              >
                <Radio value={null}>Tất cả sản phẩm</Radio>
                {categories.map(category => (
                  <Radio key={category.id} value={category.id}>
                    {category.name} ({category.product_count || 0})
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </Col>

          {/* Products Grid */}
          <Col xs={24} md={18}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Link href={`/products/${product.id}`} key={product.id} className="block h-full">
                  <Card
                    hoverable
                    className="h-full flex flex-col"
                    cover={
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder-product.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <div className="mt-2">
                          <p className="text-lg font-bold text-red-600">
                            {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                            {product.original_price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {new Intl.NumberFormat('vi-VN').format(product.original_price)}đ
                              </span>
                            )}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-600">
                                4.5 (10 đánh giá)
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                onShowSizeChange={(_, size) => handlePageChange(1, size)}
                showSizeChanger
                pageSizeOptions={['12', '24', '48', '96']}
                showTotal={total => `Tổng ${total} sản phẩm`}
                className="ant-pagination"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsPage;