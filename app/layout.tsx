import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalLayout from "./common/components/layouts/ConditionalLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vạn Lộc Infotech - Thiết bị công nghệ hàng đầu Việt Nam",
  description: "Chuyên cung cấp thiết bị công nghệ, camera an ninh, máy chấm công, kiểm soát ra vào",
};

import AntdRegistry from "../lib/AntdRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
