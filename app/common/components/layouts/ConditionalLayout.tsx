"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "../../contexts/CartContext";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Remove flex classes from body for admin routes
    const body = document.body;
    if (isAdminRoute) {
      body.classList.remove("flex", "flex-col", "min-h-screen");
    } else {
      body.classList.add("flex", "flex-col", "min-h-screen");
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    // Admin routes - no header/footer
    return <>{children}</>;
  }

  // Website routes - with header/footer
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}

