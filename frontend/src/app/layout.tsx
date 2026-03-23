import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Wealth Manager",
  description: "資産管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background text-gray-900 font-sans antialiased">
        <AuthProvider>
          <Header />
          <main className="max-w-layout mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
