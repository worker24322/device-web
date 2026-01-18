"use client";

import {
    ClockCircleOutlined,
    GiftOutlined,
    MailOutlined,
    PhoneOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Badge, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import CartDrawer from "../CartDrawer";
import SearchAutocomplete from "../SearchAutocomplete";
import Container from "./Container";

const Header = () => {
  const { getTotalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar với thông tin liên hệ */}
      <div className="bg-primary text-white py-2">
        <Container className="px-3 md:px-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-between text-sm sm:text-base gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-base sm:text-lg" />
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="tel:0387335333"
                    className="hover:text-gray-200 transition-colors font-semibold text-base sm:text-lg whitespace-nowrap"
                  >
                    038 733 5333
                  </a>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <a
                    href="tel:0909309072"
                    className="hover:text-gray-200 transition-colors font-semibold text-base sm:text-lg whitespace-nowrap"
                  >
                    090 930 9072
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MailOutlined />
                <span className="whitespace-nowrap text-xs sm:text-sm">
                  info@vanlucinfotech.vn
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ClockCircleOutlined />
                <span className="whitespace-nowrap text-xs sm:text-sm">
                  8:00 - 20:00 (T2 - CN)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/promotions"
                className="hover:text-gray-200 transition-colors flex items-center gap-1 text-xs sm:text-sm"
              >
                <GiftOutlined />
                <span>Khuyến mãi</span>
              </Link>
              <Link
                href="/news"
                className="hover:text-gray-200 transition-colors text-xs sm:text-sm"
              >
                Tin tức
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <div className="py-3 md:py-4 bg-white">
        <Container className="px-3 md:px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            {/* Logo và thông tin công ty */}
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-start">
              <Link href="/" className="flex items-center flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-lg border border-gray-200 shadow-sm"
                />
              </Link>
              <div className="hidden md:block">
                <h1 className="font-bold text-base md:text-lg text-gray-800">
                  Vạn Lộc Infotech
                </h1>
                <p className="text-xs text-gray-600">
                  Thiết bị công nghệ hàng đầu Việt Nam
                </p>
              </div>
              <div className="md:hidden text-center">
                <h1 className="font-bold text-base text-gray-800">
                  Vạn Lộc Infotech
                </h1>
                <p className="text-xs text-gray-600">
                  Thiết bị công nghệ hàng đầu Việt Nam
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="hidden md:block flex-1 w-full md:max-w-xl lg:max-w-2xl">
              <SearchAutocomplete 
                className="w-full"
                placeholder="Tìm kiếm sản phẩm..."
                size="large"
              />
            </div>

            {/* Giỏ hàng */}
            <div className="flex items-center gap-3">
              <Badge count={getTotalItems()} offset={[-5, 5]}>
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
                  onClick={() => setCartOpen(true)}
                  className="flex items-center justify-center w-12 h-12"
                />
              </Badge>

              {/* Hotline - hidden on mobile */}
              <div className="hidden lg:flex flex-col items-end border-l border-gray-200 pl-4">
                <div className="text-xs text-gray-500">Tư vấn miễn phí</div>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:0387335333"
                    className="font-bold text-primary text-base hover:text-primary-dark transition-colors"
                  >
                    038 733 5333
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="tel:0909309072"
                    className="font-bold text-primary text-base hover:text-primary-dark transition-colors"
                  >
                    090 930 9072
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
