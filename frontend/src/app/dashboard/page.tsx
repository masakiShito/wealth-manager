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
    <div className="space-y-8">
      <h1 className="text-h1">ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hover>
          <p className="text-caption text-gray-500 mb-2">資産口座数</p>
          <p className="text-4xl font-bold text-gray-900">{accounts.length}</p>
        </Card>
        <Card hover>
          <p className="text-caption text-gray-500 mb-2">今月の収入</p>
          <p className="text-4xl font-bold text-success">
            {thisMonthCf ? `¥${fmt(thisMonthCf.income)}` : "---"}
          </p>
        </Card>
        <Card hover>
          <p className="text-caption text-gray-500 mb-2">今月の支出</p>
          <p className="text-4xl font-bold text-danger">
            {thisMonthCf ? `¥${fmt(thisMonthCf.expense)}` : "---"}
          </p>
        </Card>
      </div>

      {thisMonthCf && (
        <Card>
          <p className="text-caption text-gray-500 mb-2">今月の積立額</p>
          <p className="text-3xl font-bold text-primary">
            ¥{fmt(thisMonthCf.savings)}
          </p>
        </Card>
      )}

      <div className="flex gap-4">
        <Link href="/assets">
          <Button size="lg">資産口座を管理する</Button>
        </Link>
        <Link href="/cashflows">
          <Button variant="outline" size="lg">月次収支を管理する</Button>
        </Link>
      </div>
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
