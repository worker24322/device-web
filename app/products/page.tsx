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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
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
        categoryService.getHierarchy(),
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
  const handleCategoryChange = (categoryId: number | undefined) => {
    setFilters(prev => ({ ...prev, categories: categoryId ? [categoryId] : [] }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-primary p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/80 rounded-full"></span>
                  Danh mục sản phẩm
                </h3>
              </div>
              
              <div className="p-4">
                <Radio.Group
                  className="w-full"
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  value={filters.categories.length > 0 ? filters.categories[0] : undefined}
                >
                  <div className="mb-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-primary transition-colors">
                    <Radio value={undefined} className="w-full">
                      <span className="font-medium text-gray-700">Tất cả sản phẩm</span>
                    </Radio>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category.id} className="mb-3">
                      <div className="group">
                        <div 
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            filters.categories.includes(category.id) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                          }`}
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <Radio 
                            value={category.id} 
                            className="flex-1 pointer-events-none"
                          >
                            <span className={`font-semibold transition-colors ${
                              filters.categories.includes(category.id)
                                ? 'text-primary'
                                : 'text-gray-800 group-hover:text-primary'
                            }`}>
                              {category.name}
                            </span>
                            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {category.product_count || 0}
                            </span>
                          </Radio>
                          {category.children && category.children.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(category.id);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary transition-all duration-200 flex-shrink-0 ml-2"
                            >
                              <span className="text-xs">
                                {expandedCategories.has(category.id) ? '−' : '+'}
                              </span>
                            </button>
                          )}
                        </div>
                        
                        {/* Child categories */}
                        <div className={`overflow-hidden transition-all duration-300 ${category.children && category.children.length > 0 && expandedCategories.has(category.id) ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                          {category.children && category.children.length > 0 && (
                            <div className="ml-4 p-2 space-y-1">
                              {category.children.map(child => (
                                <div key={child.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <Radio value={child.id} className="flex-1">
                                    <span className="text-gray-700 hover:text-primary transition-colors">
                                      {child.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-400">
                                      ({child.product_count || 0})
                                    </span>
                                  </Radio>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Radio.Group>
              </div>
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