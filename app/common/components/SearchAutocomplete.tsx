"use client";

import { Product, productService } from "@/lib/services/product.service";
import { uploadService } from "@/lib/services/upload.service";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  size?: "large" | "middle" | "small";
}

const SearchAutocomplete = ({
  className = "",
  placeholder = "Tìm kiếm sản phẩm...",
  size = "large"
}: SearchAutocompleteProps) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchProducts = async (query: string, pageNum: number = 1, append: boolean = false) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await productService.getAll({
        search: query,
        page: pageNum,
        pageSize: 10,
      });

      if (response.success && response.data) {
        const newProducts = response.data.data;
        setProducts(prev => append ? [...prev, ...newProducts] : newProducts);
        setHasMore(response.data.pagination.has_next);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback((value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      fetchProducts(value, 1, false);
    }, 300);
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSelect = (value: string, option: any) => {
    const productId = option.key;
    router.push(`/products/${productId}`);
    setSearchValue("");
    setProducts([]);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (bottom && hasMore && !loading && searchValue.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchValue, nextPage, true);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const options = products.map((product) => ({
    key: product.id.toString(),
    value: product.name,
    label: (
      <div className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer">
        <div className="relative w-12 h-12 shrink-0">
          <Image
            src={uploadService.getImageUrl(product.image)}
            alt={product.name}
            fill
            className="object-cover rounded"
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{product.name}</div>
          <div className="text-red-600 font-semibold text-sm">
            {formatCurrency(product.price)}
          </div>
        </div>
      </div>
    ),
  }));

  if (loading && products.length > 0) {
    options.push({
      key: "loading",
      value: "loading",
      label: (
        <div className="flex justify-center py-2">
          <Spin size="small" />
        </div>
      ),
    } as any);
  }

  return (
    <AutoComplete
      value={searchValue}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      className={className}
      popupMatchSelectWidth={false}
      popupClassName="search-autocomplete-dropdown"
      notFoundContent={
        loading ? (
          <div className="flex justify-center py-4">
            <Spin />
          </div>
        ) : searchValue.trim() ? (
          <div className="text-center py-4 text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        ) : null
      }
      popupRender={(menu) => (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {menu}
        </div>
      )}
    >
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${size === "large" ? "h-12 text-base" : "h-10 text-sm"
            }`}
        />
        <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </AutoComplete>
  );
};

export default SearchAutocomplete;
