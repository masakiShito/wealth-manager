"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchApiWithAuth } from "@/lib/api";
import type { AssetAccount, AssetType } from "@/types";
import { Button, Card, Input, Select, Alert } from "@/components/ui";
import Loading from "@/components/ui/Loading";

function AssetsContent() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<AssetAccount[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formInstitution, setFormInstitution] = useState("");
  const [formTypeId, setFormTypeId] = useState<number | "">("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [showTypeForm, setShowTypeForm] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeCategory, setTypeCategory] = useState("");
  const [typeSubmitting, setTypeSubmitting] = useState(false);

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
    return <Loading message="資産データを取得中..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h1">資産口座管理</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTypeForm(!showTypeForm)}
          >
            {showTypeForm ? "種別追加を閉じる" : "資産種別を追加"}
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "フォームを閉じる" : "口座を追加"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {showTypeForm && (
        <Card>
          <form onSubmit={handleAddType} className="space-y-4">
            <h2 className="text-h3">資産種別を追加</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="typeName"
                label="種別名"
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="例: 普通預金"
              />
              <Input
                id="typeCategory"
                label="カテゴリ"
                type="text"
                value={typeCategory}
                onChange={(e) => setTypeCategory(e.target.value)}
                placeholder="例: 預金"
              />
            </div>
            <Button type="submit" disabled={typeSubmitting} size="sm">
              {typeSubmitting ? "追加中..." : "種別を追加"}
            </Button>
          </form>
        </Card>
      )}

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="space-y-4">
            <h2 className="text-h3">新規口座を追加</h2>
            {assetTypes.length === 0 && (
              <Alert variant="warning">
                資産種別が登録されていません。先に「資産種別を追加」から種別を追加してください。
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                id="accountType"
                label="資産種別"
                value={formTypeId}
                onChange={(e) =>
                  setFormTypeId(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">選択してください</option>
                {assetTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.category})
                  </option>
                ))}
              </Select>
              <Input
                id="accountName"
                label="口座名"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="例: メイン口座"
              />
              <Input
                id="accountInstitution"
                label="金融機関名"
                type="text"
                value={formInstitution}
                onChange={(e) => setFormInstitution(e.target.value)}
                placeholder="例: 三菱UFJ銀行"
              />
            </div>
            <Button
              type="submit"
              disabled={formSubmitting || assetTypes.length === 0}
              size="sm"
            >
              {formSubmitting ? "追加中..." : "口座を追加"}
            </Button>
          </form>
        </Card>
      )}

      {accounts.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-gray-700">
            口座が登録されていません。「口座を追加」ボタンから追加してください。
          </p>
        </Card>
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <table className="w-full text-caption">
            <thead>
              <tr className="border-b border-gray-200 bg-background-subtle">
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  資産種別
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  口座名
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  金融機関
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr
                  key={acc.id}
                  className="border-b border-gray-200 last:border-b-0 transition-base hover:bg-background-subtle/50"
                >
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
                          className="border border-gray-200 rounded-lg px-2 py-1.5 w-full text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editInstitution}
                          onChange={(e) => setEditInstitution(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 w-full text-caption focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-base"
                        />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleUpdate(acc.id)}
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
                      <td className="px-4 py-3">
                        {acc.asset_type.name}
                        <span className="text-gray-500 ml-1 text-xs">
                          ({acc.asset_type.category})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{acc.name}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {acc.institution}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button
                          onClick={() => {
                            setEditId(acc.id);
                            setEditName(acc.name);
                            setEditInstitution(acc.institution);
                          }}
                          className="text-primary font-medium hover:text-primary-light transition-base"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(acc.id)}
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

export default function AssetsPage() {
  return (
    <AuthGuard>
      <AssetsContent />
    </AuthGuard>
  );
}
