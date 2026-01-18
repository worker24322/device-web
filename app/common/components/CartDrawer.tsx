"use client";

import React from "react";
import { Drawer, Button, InputNumber, Empty } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <ShoppingOutlined />
          <span>Giỏ hàng của bạn</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      footer={
        items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">{formatCurrency(getTotalPrice())}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={clearCart} danger>
                Xóa tất cả
              </Button>
              <Link href="/checkout" onClick={onClose}>
                <Button type="primary" className="w-full">
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <Empty
          description="Giỏ hàng trống"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 pb-4 border-b border-gray-200"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </h4>
                <p className="text-primary font-semibold mt-1">
                  {formatCurrency(item.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => updateQuantity(item.id, value || 1)}
                    size="small"
                    className="w-20"
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;

