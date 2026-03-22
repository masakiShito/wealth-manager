"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { AssetAccount, AssetType } from "@/types";

function AssetsContent() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<AssetAccount[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add account form
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formInstitution, setFormInstitution] = useState("");
  const [formTypeId, setFormTypeId] = useState<number | "">("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Add asset type form
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeCategory, setTypeCategory] = useState("");
  const [typeSubmitting, setTypeSubmitting] = useState(false);

  // Edit
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editInstitution, setEditInstitution] = useState("");

  const load = async () => {
    if (!token) return;
    try {
      const [a, t] = await Promise.all([
        fetchApiWithAuth<AssetAccount[]>("/api/v1/assets/accounts", token),
        fetchApiWithAuth<AssetType[]>("/api/v1/assets/types", token),
      ]);
      setAccounts(a);
      setAssetTypes(t);
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

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !typeName || !typeCategory) return;
    setTypeSubmitting(true);
    try {
      await fetchApiWithAuth<AssetType>("/api/v1/assets/types", token, {
        method: "POST",
        body: JSON.stringify({ name: typeName, category: typeCategory }),
      });
      setTypeName("");
      setTypeCategory("");
      setShowTypeForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "種別追加に失敗しました。");
    } finally {
      setTypeSubmitting(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formName || !formTypeId) return;
    setFormSubmitting(true);
    setError("");
    try {
      await fetchApiWithAuth<AssetAccount>("/api/v1/assets/accounts", token, {
        method: "POST",
        body: JSON.stringify({
          asset_type_id: formTypeId,
          name: formName,
          institution: formInstitution,
        }),
      });
      setFormName("");
      setFormInstitution("");
      setFormTypeId("");
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "口座追加に失敗しました。");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!token) return;
    setError("");
    try {
      await fetchApiWithAuth<AssetAccount>(
        `/api/v1/assets/accounts/${id}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: editName,
            institution: editInstitution,
          }),
        }
      );
      setEditId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました。");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("この口座を削除しますか？")) return;
    setError("");
    try {
      await fetchApiWithAuth<void>(`/api/v1/assets/accounts/${id}`, token, {
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
        <h1 className="text-2xl font-bold">資産口座管理</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTypeForm(!showTypeForm)}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 text-sm"
          >
            {showTypeForm ? "種別追加を閉じる" : "資産種別を追加"}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            {showForm ? "フォームを閉じる" : "口座を追加"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>
      )}

      {showTypeForm && (
        <form
          onSubmit={handleAddType}
          className="bg-white border border-gray-200 rounded-lg p-5 space-y-4"
        >
          <h2 className="font-semibold">資産種別を追加</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="typeName"
                className="block text-sm font-medium mb-1"
              >
                種別名
              </label>
              <input
                id="typeName"
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="例: 普通預金"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="typeCategory"
                className="block text-sm font-medium mb-1"
              >
                カテゴリ
              </label>
              <input
                id="typeCategory"
                type="text"
                value={typeCategory}
                onChange={(e) => setTypeCategory(e.target.value)}
                placeholder="例: 預金"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={typeSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {typeSubmitting ? "追加中..." : "種別を追加"}
          </button>
        </form>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-lg p-5 space-y-4"
        >
          <h2 className="font-semibold">新規口座を追加</h2>
          {assetTypes.length === 0 && (
            <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
              資産種別が登録されていません。先に「資産種別を追加」から種別を追加してください。
            </p>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="accountType"
                className="block text-sm font-medium mb-1"
              >
                資産種別
              </label>
              <select
                id="accountType"
                value={formTypeId}
                onChange={(e) =>
                  setFormTypeId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {assetTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="accountName"
                className="block text-sm font-medium mb-1"
              >
                口座名
              </label>
              <input
                id="accountName"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例: メイン口座"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="accountInstitution"
                className="block text-sm font-medium mb-1"
              >
                金融機関名
              </label>
              <input
                id="accountInstitution"
                type="text"
                value={formInstitution}
                onChange={(e) => setFormInstitution(e.target.value)}
                placeholder="例: 三菱UFJ銀行"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={formSubmitting || assetTypes.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {formSubmitting ? "追加中..." : "口座を追加"}
          </button>
        </form>
      )}

      {accounts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          口座が登録されていません。「口座を追加」ボタンから追加してください。
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">資産種別</th>
                <th className="text-left px-4 py-3 font-medium">口座名</th>
                <th className="text-left px-4 py-3 font-medium">金融機関</th>
                <th className="text-right px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id} className="border-b border-gray-100">
                  {editId === acc.id ? (
                    <>
                      <td className="px-4 py-3 text-gray-500">
                        {acc.asset_type.name} ({acc.asset_type.category})
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editInstitution}
                          onChange={(e) => setEditInstitution(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdate(acc.id)}
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
                        {acc.asset_type.name}
                        <span className="text-gray-400 ml-1 text-xs">
                          ({acc.asset_type.category})
                        </span>
                      </td>
                      <td className="px-4 py-3">{acc.name}</td>
                      <td className="px-4 py-3">{acc.institution}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditId(acc.id);
                            setEditName(acc.name);
                            setEditInstitution(acc.institution);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(acc.id)}
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

export default function AssetsPage() {
  return (
    <AuthGuard>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AssetsContent />
      </main>
    </AuthGuard>
  );
}
