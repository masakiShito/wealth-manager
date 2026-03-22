"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { AssetAccount, Cashflow } from "@/types";

function DashboardContent() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<AssetAccount[]>([]);
  const [cashflows, setCashflows] = useState<Cashflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetchApiWithAuth<AssetAccount[]>("/api/v1/assets/accounts", token),
      fetchApiWithAuth<Cashflow[]>("/api/v1/cashflows", token),
    ])
      .then(([a, c]) => {
        setAccounts(a);
        setCashflows(c);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCf = cashflows.find(
    (cf) => cf.year_month.slice(0, 7) === currentMonth
  );

  const fmt = (v: string | undefined) => {
    if (!v) return "---";
    return Number(v).toLocaleString("ja-JP");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">資産口座数</p>
          <p className="text-3xl font-bold">{accounts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">今月の収入</p>
          <p className="text-3xl font-bold text-green-600">
            {thisMonthCf ? `¥${fmt(thisMonthCf.income)}` : "---"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">今月の支出</p>
          <p className="text-3xl font-bold text-red-600">
            {thisMonthCf ? `¥${fmt(thisMonthCf.expense)}` : "---"}
          </p>
        </div>
      </div>

      {thisMonthCf && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">今月の積立額</p>
          <p className="text-2xl font-bold text-blue-600">
            ¥{fmt(thisMonthCf.savings)}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href="/assets"
          className="bg-blue-600 text-white px-5 py-2.5 rounded hover:bg-blue-700"
        >
          資産口座を管理する
        </Link>
        <Link
          href="/cashflows"
          className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded hover:bg-blue-50"
        >
          月次収支を管理する
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <DashboardContent />
      </main>
    </AuthGuard>
  );
}
