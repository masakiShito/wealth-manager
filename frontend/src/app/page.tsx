"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (user) return null;

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">資産管理アプリ</h1>
        <p className="text-lg text-gray-600 mb-8">
          老後資産シミュレーションを目的とした資産管理アプリ。
          <br />
          現在の資産や毎月の収支を記録し、将来の資産推移を把握しましょう。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-10">
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">資産管理</h2>
            <p className="text-sm text-gray-500">現在の総資産を把握する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">収支管理</h2>
            <p className="text-sm text-gray-500">毎月の収支と積立可能額を把握する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">老後条件設定</h2>
            <p className="text-sm text-gray-500">退職年齢・生活費・年金などを設定する</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold mb-1">シミュレーション</h2>
            <p className="text-sm text-gray-500">将来の資産推移を試算する</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded hover:bg-blue-50"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700"
          >
            新規登録
          </Link>
        </div>
      </div>
    </main>
  );
}
