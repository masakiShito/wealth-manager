# Wealth Manager - 老後資産シミュレーション

老後資産がどのくらい必要かを試算し、現在の資産状況・積立状況で老後資産が足りるかを確認するためのWebアプリです。

本プロジェクトでは、AIは開発補助にのみ利用し、アプリの機能としては利用しません。

---

## 主な機能（予定）

- 現在の資産額を管理する
- 毎月の収支・積立可能額を管理する
- 老後条件（退職年齢、寿命、老後生活費、年金見込みなど）を設定する
- 将来の老後資産シミュレーションを行う

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy, Pydantic |
| Database | MySQL 8 |
| Infrastructure | Docker, Docker Compose |

---

## ディレクトリ構成

```
wealth-manager/
├── frontend/                # Next.js (App Router)
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   ├── components/      # 共通コンポーネント
│   │   ├── lib/             # ユーティリティ・API通信
│   │   └── types/           # 型定義
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/                 # FastAPI
│   ├── app/
│   │   ├── api/v1/          # APIエンドポイント（v1）
│   │   ├── core/            # 設定・DB接続
│   │   ├── models/          # SQLAlchemyモデル
│   │   ├── schemas/         # Pydanticスキーマ
│   │   ├── services/        # ビジネスロジック
│   │   └── main.py          # アプリケーションエントリ
│   ├── Dockerfile
│   └── requirements.txt
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

## セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/masakiShito/wealth-manager.git
cd wealth-manager

# 2. 環境変数ファイルを作成
cp .env.example .env

# 3. Docker コンテナを起動
docker compose up --build
```

### アクセスURL

| サービス | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (FastAPI) | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |
| API v1 Health | http://localhost:8000/api/v1/health |
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

## 今後の実装予定

- [ ] ユーザー認証機能
- [ ] 資産種別・口座管理
- [ ] 資産スナップショット記録
- [ ] 月次収支管理
- [ ] 老後プロファイル設定
- [ ] 積立プラン管理
- [ ] 老後資産シミュレーション
- [ ] ダッシュボード・グラフ表示
- [ ] マイグレーション（Alembic）導入

---

## ライセンス

MIT
