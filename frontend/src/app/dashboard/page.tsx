"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { AssetAccount, Cashflow } from "@/types";
import { Button, Card, Loading } from "@/components/ui";

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
    return <Loading message="データを取得中..." />;
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
    <div className="space-y-[32px]">
      <div>
        <h1 className="text-h1 text-gray-900">ダッシュボード</h1>
        <p className="text-caption text-gray-500 mt-1">資産状況の概要</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hover padding="lg">
          <p className="text-caption text-gray-500 mb-1 tracking-wide uppercase">資産口座数</p>
          <p className="text-[32px] font-bold text-gray-900 leading-tight">{accounts.length}</p>
          <p className="text-caption text-gray-500 mt-2">登録済みの口座</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-caption text-gray-500 mb-1 tracking-wide uppercase">今月の収入</p>
          <p className="text-[32px] font-bold text-success leading-tight">
            {thisMonthCf ? `¥${fmt(thisMonthCf.income)}` : "---"}
          </p>
          <p className="text-caption text-gray-500 mt-2">{currentMonth} の収入合計</p>
        </Card>
        <Card hover padding="lg">
          <p className="text-caption text-gray-500 mb-1 tracking-wide uppercase">今月の支出</p>
          <p className="text-[32px] font-bold text-danger leading-tight">
            {thisMonthCf ? `¥${fmt(thisMonthCf.expense)}` : "---"}
          </p>
          <p className="text-caption text-gray-500 mt-2">{currentMonth} の支出合計</p>
        </Card>
      </div>

      {thisMonthCf && (
        <Card padding="lg">
          <p className="text-caption text-gray-500 mb-1 tracking-wide uppercase">今月の積立額</p>
          <p className="text-[32px] font-bold text-primary leading-tight">
            ¥{fmt(thisMonthCf.savings)}
          </p>
          <p className="text-caption text-gray-500 mt-2">毎月の貯蓄目標</p>
        </Card>
      )}

      <Card padding="lg">
        <p className="text-caption text-gray-500 mb-4 tracking-wide uppercase">クイックアクション</p>
        <div className="flex gap-4">
          <Link href="/assets">
            <Button size="lg">資産口座を管理する</Button>
          </Link>
          <Link href="/cashflows">
            <Button variant="outline" size="lg">月次収支を管理する</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
