"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/dashboard", label: "ダッシュボード" },
    { href: "/assets", label: "資産口座" },
    { href: "/cashflows", label: "月次収支" },
  ];

  return (
    <header className="bg-background-card border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-layout mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-h3 font-bold text-primary transition-base hover:text-primary-light"
          >
            Wealth Manager
          </Link>
          {user && (
            <nav className="hidden sm:flex gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 rounded-lg text-caption font-medium transition-base
                    ${
                      pathname === link.href
                        ? "bg-background-subtle text-primary font-semibold"
                        : "text-gray-700 hover:bg-background-subtle hover:text-primary"
                    }
                  `.trim()}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? null : user ? (
            <>
              <span className="text-caption text-gray-700 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-caption text-gray-500 hover:text-danger transition-base"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-caption text-gray-700 hover:text-primary transition-base"
              >
                ログイン
              </Link>
              <Button size="sm" onClick={() => router.push("/register")}>
                新規登録
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
