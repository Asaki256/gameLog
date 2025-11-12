import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameLog - 積みゲー管理アプリ",
  description: "複数プラットフォームの積みゲーを一元管理するWebアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  );
}
