"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { Cashflow } from "@/types";

function formatNumber(v: string | number): string {
  return Number(v).toLocaleString("ja-JP");
}

function CashflowsContent() {
  const { token } = useAuth();
  const [cashflows, setCashflows] = useState<Cashflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [formYearMonth, setFormYearMonth] = useState("");
  const [formIncome, setFormIncome] = useState("");
  const [formExpense, setFormExpense] = useState("");
  const [formSavings, setFormSavings] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit
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
    return <p className="text-gray-500">読み込み中...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">月次収支管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {showForm ? "フォームを閉じる" : "収支を追加"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-lg p-5 space-y-4"
        >
          <h2 className="font-semibold">新規収支を追加</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="yearMonth"
                className="block text-sm font-medium mb-1"
              >
                年月
              </label>
              <input
                id="yearMonth"
                type="month"
                value={formYearMonth}
                onChange={(e) => setFormYearMonth(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="income"
                className="block text-sm font-medium mb-1"
              >
                収入
              </label>
              <input
                id="income"
                type="number"
                value={formIncome}
                onChange={(e) => setFormIncome(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="expense"
                className="block text-sm font-medium mb-1"
              >
                支出
              </label>
              <input
                id="expense"
                type="number"
                value={formExpense}
                onChange={(e) => setFormExpense(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="savings"
                className="block text-sm font-medium mb-1"
              >
                積立額
              </label>
              <input
                id="savings"
                type="number"
                value={formSavings}
                onChange={(e) => setFormSavings(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={formSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {formSubmitting ? "追加中..." : "収支を追加"}
          </button>
        </form>
      )}

      {cashflows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          収支データが登録されていません。「収支を追加」ボタンから追加してください。
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">年月</th>
                <th className="text-right px-4 py-3 font-medium">収入</th>
                <th className="text-right px-4 py-3 font-medium">支出</th>
                <th className="text-right px-4 py-3 font-medium">積立額</th>
                <th className="text-right px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {cashflows.map((cf) => (
                <tr key={cf.id} className="border-b border-gray-100">
                  {editId === cf.id ? (
                    <>
                      <td className="px-4 py-3">
                        {cf.year_month.slice(0, 7)}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editIncome}
                          onChange={(e) => setEditIncome(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editExpense}
                          onChange={(e) => setEditExpense(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editSavings}
                          onChange={(e) => setEditSavings(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdate(cf.id)}
                          className="text-blue-600 hover:underline"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-gray-500 hover:underline"
                        >
                          取消
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        {cf.year_month.slice(0, 7)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600">
                        ¥{formatNumber(cf.income)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        ¥{formatNumber(cf.expense)}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-600">
                        ¥{formatNumber(cf.savings)}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditId(cf.id);
                            setEditIncome(String(cf.income));
                            setEditExpense(String(cf.expense));
                            setEditSavings(String(cf.savings));
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(cf.id)}
                          className="text-red-600 hover:underline"
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
        </div>
      )}
    </div>
  );
}

export default function CashflowsPage() {
  return (
    <AuthGuard>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <CashflowsContent />
      </main>
    </AuthGuard>
  );
}
