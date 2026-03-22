あなたは優秀なフロントエンドエンジニアです。
以下の要件・設計方針・制約に厳密に従って、資産管理アプリのフロントエンド画面を実装してください。

# 0. プロジェクトの前提

このプロジェクトは「老後資産がどのくらい必要かを把握し、今の資産状況・積立状況で将来足りるのかを確認する」ことを目的とした資産管理アプリです。

バックエンドAPI（FastAPI）は既に実装済みで、以下のエンドポイントが利用可能です。

## 実装済みAPI一覧

### 認証
- POST /api/v1/auth/register — ユーザー登録
  - リクエスト: { email: string, password: string, name: string }
  - レスポンス: { id: number, email: string, name: string, created_at: string }
- POST /api/v1/auth/login — ログイン（JWTトークン発行）
  - リクエスト: { email: string, password: string }
  - レスポンス: { access_token: string, token_type: "bearer" }
- GET /api/v1/auth/me — 認証ユーザー情報取得（要Bearer Token）
  - レスポンス: { id: number, email: string, name: string, created_at: string }

### 資産種別
- GET /api/v1/assets/types — 資産種別一覧
  - レスポンス: [{ id: number, name: string, category: string }]
- POST /api/v1/assets/types — 資産種別作成（要認証）
  - リクエスト: { name: string, category: string }

### 資産口座
- GET /api/v1/assets/accounts — 自分の口座一覧（要認証）
  - レスポンス: [{ id: number, user_id: number, asset_type_id: number, name: string, institution: string, created_at: string, asset_type: { id: number, name: string, category: string } }]
- POST /api/v1/assets/accounts — 口座作成（要認証）
  - リクエスト: { asset_type_id: number, name: string, institution: string }
- PATCH /api/v1/assets/accounts/{id} — 口座更新（要認証）
  - リクエスト: { name?: string, institution?: string }
- DELETE /api/v1/assets/accounts/{id} — 口座削除（要認証）

### 月次収支
- GET /api/v1/cashflows — 収支一覧（要認証、year_month降順）
  - レスポンス: [{ id: number, user_id: number, year_month: string, income: string, expense: string, savings: string, created_at: string }]
- POST /api/v1/cashflows — 収支作成（要認証、同月重複不可）
  - リクエスト: { year_month: string (YYYY-MM-DD形式で月初日), income: number, expense: number, savings: number }
- PATCH /api/v1/cashflows/{id} — 収支更新（要認証）
  - リクエスト: { income?: number, expense?: number, savings?: number }
- DELETE /api/v1/cashflows/{id} — 収支削除（要認証）

### ヘルスチェック
- GET /api/v1/health — { status: "ok" }

---

# 1. 技術スタック（既存）

- Next.js 15（App Router）
- React 19
- TypeScript
- Tailwind CSS

UIコンポーネントライブラリは導入しません。Tailwind CSSのみで構築してください。
状態管理ライブラリも導入しません。React標準のuseState / useContext で管理してください。

---

# 2. 既存のフロントエンド構成

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # ルートレイアウト（lang="ja", Tailwind適用済み）
│   │   ├── page.tsx            # トップページ（静的な説明のみ）
│   │   └── globals.css         # Tailwind インポート済み
│   ├── components/             # 空（.gitkeepのみ）
│   ├── features/               # 空（.gitkeepのみ）
│   ├── lib/
│   │   └── api.ts              # fetchApi<T>(path, options) 関数あり
│   └── types/
│       └── index.ts            # HealthResponse のみ定義
├── package.json                # next 15.1.3, react ^19.0.0
├── tailwind.config.ts
├── tsconfig.json               # @/* -> ./src/* パスエイリアス設定済み
└── next.config.ts
```

### 既存の lib/api.ts の内容

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
```

---

# 3. 今回実装する画面

以下の画面を実装してください。

## 3-1. 共通レイアウト
- ヘッダー（アプリ名、ナビゲーション、ログイン状態表示）
- 未ログイン時: 「ログイン」「新規登録」リンクを表示
- ログイン時: ユーザー名と「ログアウト」ボタンを表示
- ナビゲーション（ログイン時のみ）: ダッシュボード、資産口座、月次収支

## 3-2. ユーザー登録ページ（/register）
- 名前、メールアドレス、パスワードの入力フォーム
- 登録成功後、ログインページにリダイレクト
- バリデーションエラーの表示

## 3-3. ログインページ（/login）
- メールアドレス、パスワードの入力フォーム
- ログイン成功後、トークンを保存してダッシュボードにリダイレクト
- エラーメッセージの表示

## 3-4. ダッシュボード（/dashboard）
- 要認証（未ログインなら/loginにリダイレクト）
- 資産口座数、今月の収支サマリを表示
- 各機能への導線リンク

## 3-5. 資産口座管理ページ（/assets）
- 要認証
- 口座一覧を表示（資産種別、口座名、金融機関名）
- 新規口座追加フォーム（モーダルまたはインライン）
- 口座の編集・削除機能
- 資産種別がまだ無い場合は種別の追加もできるようにする

## 3-6. 月次収支管理ページ（/cashflows）
- 要認証
- 収支一覧を表示（年月、収入、支出、積立額）
- 新規収支追加フォーム
- 収支の編集・削除機能
- 金額はカンマ区切りで表示

## 3-7. トップページ（/ ）の更新
- 既存のトップページを改修
- 未ログイン時: アプリ説明 + ログイン・新規登録への導線
- ログイン時: ダッシュボードにリダイレクト

---

# 4. 認証の実装方針

- JWTトークンはlocalStorageに保存する
- AuthContextを作成し、useContextで認証状態を管理する
- AuthContextが提供するもの:
  - user: ユーザー情報 | null
  - token: string | null
  - login(email, password): Promise<void>
  - register(email, password, name): Promise<void>
  - logout(): void
  - isLoading: boolean（初期化中のフラグ）
- ページ読み込み時にlocalStorageのトークンで /auth/me を叩いてユーザー情報を復元する
- API呼び出し時はAuthorizationヘッダーにBearerトークンを付与する
- lib/api.ts を拡張して認証付きリクエスト用の関数を追加する

---

# 5. ディレクトリ構成方針

以下の構成で整理してください。

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（AuthProvider含む）
│   ├── page.tsx                # トップページ
│   ├── login/page.tsx          # ログイン
│   ├── register/page.tsx       # 新規登録
│   ├── dashboard/page.tsx      # ダッシュボード
│   ├── assets/page.tsx         # 資産口座管理
│   └── cashflows/page.tsx      # 月次収支管理
├── components/
│   ├── Header.tsx              # 共通ヘッダー
│   └── AuthGuard.tsx           # 認証ガード（未ログインならリダイレクト）
├── features/
│   └── auth/
│       └── AuthContext.tsx      # 認証コンテキスト
├── lib/
│   └── api.ts                  # API通信（既存を拡張）
└── types/
    └── index.ts                # 型定義
```

---

# 6. UI方針

- Tailwind CSSのみ使用（UIライブラリ不使用）
- シンプルで整った見た目にする
- カラーは白・グレー・青系を基調にする
- レスポンシブ対応は不要（PC表示のみで可）
- フォームはlabelとinputを適切に紐付ける
- ボタンは用途が分かるスタイルにする（プライマリ: 青系、削除: 赤系）
- ローディング中は「読み込み中...」等を表示する
- エラーは赤文字で表示する

---

# 7. コーディング方針

- TypeScript の型を適切に定義する
- "use client" は必要なコンポーネントにのみ付ける
- App Router のルーティング規約に従う
- fetchApi を活用し、API呼び出しコードを統一する
- 不要なライブラリは追加しない
- 過度な抽象化はしない
- コメントは必要最小限
- 実行可能性を最優先する

---

# 8. 今回やらないこと

- サーバーコンポーネントでのデータフェッチ最適化（全てクライアントサイドで可）
- テストコード
- i18n対応
- アクセシビリティの厳密な対応
- ダークモード
- アニメーション
- 資産スナップショット画面
- 老後プロファイル・シミュレーション画面

---

# 9. 環境変数

フロントエンドが使う環境変数は以下のみです。既にdocker-compose.ymlで設定済みです。

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

# 10. 受け入れ条件

以下を満たす状態を完成条件とします。

- docker compose up --build で起動できる
- http://localhost:3000 でトップページが表示される
- ユーザー登録 → ログインができる
- ログイン後、ヘッダーにユーザー名が表示される
- ダッシュボードに口座数・収支サマリが表示される
- 資産種別の追加、口座の追加・編集・削除ができる
- 月次収支の追加・編集・削除ができる
- ログアウトするとトップページに戻る
- 未ログインで /dashboard, /assets, /cashflows にアクセスすると /login にリダイレクトされる

---

# 11. 出力ルール

- ファイルの省略は禁止
- 「以下同様」などの省略は禁止
- 実行に必要なファイルはすべて出力すること
- import の整合性が取れるようにすること
- コードはコピペでファイル化できる完成形にすること
- 既存のpackage.jsonは変更不要（追加パッケージなし）
