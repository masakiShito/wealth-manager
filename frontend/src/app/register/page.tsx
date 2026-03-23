"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { Button, Card, Input, Alert } from "@/components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("すべての項目を入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password, name);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <Card className="w-full max-w-md" padding="lg">
        <h1 className="text-h2 text-center mb-8">新規登録</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            type="text"
            label="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="email"
            type="email"
            label="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            label="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? "登録中..." : "登録する"}
          </Button>
        </form>

        <p className="mt-6 text-body text-center text-gray-700">
          アカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-primary-light transition-base"
          >
            ログイン
          </Link>
        </p>
      </Card>
    </div>
  );
}
