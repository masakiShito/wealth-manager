# Wealth Manager - 老後資産シミュレーション

老後資産がどのくらい必要かを試算し、現在の資産状況・積立状況で老後資産が足りるかを確認するためのWebアプリです。

> **注意**: 本プロジェクトでは、AIは開発補助にのみ利用し、アプリの機能としては利用しません。

---

## このアプリの目的

- 現在の総資産を把握する
- 毎月の収支と積立可能額を把握する
- 老後条件（退職年齢、寿命、生活費、年金など）を設定する
- 将来の老後資産シミュレーションを行い、過不足を確認する

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy, Pydantic |
| Database | MySQL 8.0 |
| Infrastructure | Docker, Docker Compose |
| Code Quality | ESLint (frontend), Ruff (backend) |

---

## ディレクトリ構成

```
wealth-manager/
├── frontend/                # Next.js (App Router)
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   ├── components/      # 共通コンポーネント
│   │   ├── features/        # 機能別モジュール
│   │   ├── lib/             # ユーティリティ・API通信
│   │   └── types/           # 型定義
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/                 # FastAPI
│   ├── app/
│   │   ├── api/v1/          # APIエンドポイント（v1）
│   │   ├── core/            # 設定・共通設定
│   │   ├── db/              # DB接続・セッション管理
│   │   ├── models/          # SQLAlchemyモデル
│   │   ├── schemas/         # Pydanticスキーマ
│   │   ├── services/        # ビジネスロジック
│   │   └── main.py          # アプリケーションエントリ
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ruff.toml
├── db/
│   └── init/                # DB初期化SQL
├── docs/                    # ドキュメント
│   ├── overview.md          # プロジェクト概要
│   └── er.md                # ER図・テーブル設計
├── docker-compose.yml
├── .env.example             # 環境変数テンプレート
└── README.md
```

---

## 起動手順

### 前提条件

- Docker および Docker Compose がインストールされていること

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/masakiShito/wealth-manager.git
cd wealth-manager

# 2. 環境変数ファイルを作成
cp .env.example .env

# 3. Docker コンテナをビルド・起動
docker compose up --build
```

初回起動時はビルドに数分かかります。すべてのコンテナが起動するまでお待ちください。

### アクセスURL

| サービス | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (FastAPI) | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/v1/health |
| MySQL | localhost:3306 |

### コンテナの停止

```bash
docker compose down
```

### データを含めて完全にリセット

```bash
docker compose down -v
```

---

## 今後追加予定の機能

- [ ] ユーザー認証機能
- [ ] 資産種別・口座管理
- [ ] 資産スナップショット記録
- [ ] 月次収支管理
- [ ] 老後プロファイル設定
- [ ] 積立プラン管理
- [ ] 老後資産シミュレーション
- [ ] ダッシュボード・グラフ表示
- [ ] マイグレーション（Alembic）導入
- [ ] テストコード整備

---

## ライセンス

MIT
