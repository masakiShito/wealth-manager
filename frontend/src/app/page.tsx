"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { Button, Card, Loading } from "@/components/ui";

const features = [
  { title: "資産管理", description: "現在の総資産を把握する" },
  { title: "収支管理", description: "毎月の収支と積立可能額を把握する" },
  { title: "老後条件設定", description: "退職年齢・生活費・年金などを設定する" },
  { title: "シミュレーション", description: "将来の資産推移を試算する" },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <Loading fullPage />;
  }

  if (user) return null;

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center">
      <div className="max-w-2xl text-center">
        <h1 className="text-h1 text-gray-900 mb-4">
          資産管理アプリ
        </h1>
        <p className="text-body text-gray-700 mb-8 leading-relaxed max-w-xl mx-auto">
          老後資産シミュレーションを目的とした資産管理アプリ。
          <br />
          現在の資産や毎月の収支を記録し、将来の資産推移を把握しましょう。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-12">
          {features.map((feature) => (
            <Card key={feature.title} padding="md" hover>
              <h2 className="text-body font-semibold text-gray-900 mb-1">
                {feature.title}
              </h2>
              <p className="text-caption text-gray-700">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="outline" size="lg">
              ログイン
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg">
              新規登録
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
