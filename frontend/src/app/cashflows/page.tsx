"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { Cashflow } from "@/types";
import { Button, Card, Input, Alert } from "@/components/ui";
import Loading from "@/components/ui/Loading";

function formatNumber(v: string | number): string {
  return Number(v).toLocaleString("ja-JP");
}

function CashflowsContent() {
  const { token } = useAuth();
  const [cashflows, setCashflows] = useState<Cashflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formYearMonth, setFormYearMonth] = useState("");
  const [formIncome, setFormIncome] = useState("");
  const [formExpense, setFormExpense] = useState("");
  const [formSavings, setFormSavings] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editIncome, setEditIncome] = useState("");
  const [editExpense, setEditExpense] = useState("");
  const [editSavings, setEditSavings] = useState("");

  const load = async () => {
    if (!token) return;
    try {
      const data = await fetchApiWithAuth<Cashflow[]>(
        "/api/v1/cashflows",
        token
      );
      setCashflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formYearMonth) return;
    setFormSubmitting(true);
    setError("");
    try {
      const yearMonthDate = formYearMonth + "-01";
      await fetchApiWithAuth<Cashflow>("/api/v1/cashflows", token, {
        method: "POST",
        body: JSON.stringify({
          year_month: yearMonthDate,
          income: Number(formIncome) || 0,
          expense: Number(formExpense) || 0,
          savings: Number(formSavings) || 0,
        }),
      });
      setFormYearMonth("");
      setFormIncome("");
      setFormExpense("");
      setFormSavings("");
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "追加に失敗しました。");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!token) return;
    setError("");
    try {
      await fetchApiWithAuth<Cashflow>(`/api/v1/cashflows/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({
          income: Number(editIncome) || 0,
          expense: Number(editExpense) || 0,
          savings: Number(editSavings) || 0,
        }),
      });
      setEditId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました。");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("この収支データを削除しますか？")) return;
    setError("");
    try {
      await fetchApiWithAuth<void>(`/api/v1/cashflows/${id}`, token, {
        method: "DELETE",
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました。");
    }
  };

  if (loading) {
    return <Loading message="収支データを取得中..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1">月次収支管理</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "フォームを閉じる" : "収支を追加"}
        </Button>
      </div>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="space-y-4">
            <h2 className="text-h3">新規収支を追加</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                id="yearMonth"
                label="年月"
                type="month"
                value={formYearMonth}
                onChange={(e) => setFormYearMonth(e.target.value)}
              />
              <Input
                id="income"
                label="収入"
                type="number"
                value={formIncome}
                onChange={(e) => setFormIncome(e.target.value)}
                placeholder="0"
              />
              <Input
                id="expense"
                label="支出"
                type="number"
                value={formExpense}
                onChange={(e) => setFormExpense(e.target.value)}
                placeholder="0"
              />
              <Input
                id="savings"
                label="積立額"
                type="number"
                value={formSavings}
                onChange={(e) => setFormSavings(e.target.value)}
                placeholder="0"
              />
            </div>
            <Button type="submit" disabled={formSubmitting} size="sm">
              {formSubmitting ? "追加中..." : "収支を追加"}
            </Button>
          </form>
        </Card>
      )}

      {cashflows.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-gray-500">
            収支データが登録されていません。「収支を追加」ボタンから追加してください。
          </p>
        </Card>
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <table className="w-full text-caption">
            <thead>
              <tr className="border-b border-gray-200 bg-background-subtle">
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  年月
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  収入
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  支出
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  積立額
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {cashflows.map((cf) => (
                <tr
                  key={cf.id}
                  className="border-b border-gray-200 last:border-b-0 transition-base hover:bg-background-subtle/50"
                >
                  {editId === cf.id ? (
                    <>
                      <td className="px-4 py-3 text-gray-900">
                        {cf.year_month.slice(0, 7)}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editIncome}
                          onChange={(e) => setEditIncome(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 w-full text-right text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editExpense}
                          onChange={(e) => setEditExpense(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 w-full text-right text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editSavings}
                          onChange={(e) => setEditSavings(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 w-full text-right text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base"
                        />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdate(cf.id)}
                          className="text-primary font-medium hover:text-primary-light transition-base"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-gray-500 hover:text-gray-700 transition-base"
                        >
                          取消
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-900">
                        {cf.year_month.slice(0, 7)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-success">
                        ¥{formatNumber(cf.income)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-danger">
                        ¥{formatNumber(cf.expense)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-primary">
                        ¥{formatNumber(cf.savings)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button
                          onClick={() => {
                            setEditId(cf.id);
                            setEditIncome(String(cf.income));
                            setEditExpense(String(cf.expense));
                            setEditSavings(String(cf.savings));
                          }}
                          className="text-primary font-medium hover:text-primary-light transition-base"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(cf.id)}
                          className="text-danger font-medium hover:text-danger-dark transition-base"
                        >
                          削除
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default function CashflowsPage() {
  return (
    <AuthGuard>
      <CashflowsContent />
    </AuthGuard>
  );
}
