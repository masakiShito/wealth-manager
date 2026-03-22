"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Wealth Manager
          </Link>
          {user && (
            <nav className="flex gap-4 text-sm">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                ダッシュボード
              </Link>
              <Link
                href="/assets"
                className="text-gray-600 hover:text-blue-600"
              >
                資産口座
              </Link>
              <Link
                href="/cashflows"
                className="text-gray-600 hover:text-blue-600"
              >
                月次収支
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isLoading ? null : user ? (
            <>
              <span className="text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                ログイン
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
