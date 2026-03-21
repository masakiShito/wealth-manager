# Wealth Manager

資産管理をシンプルに行うためのWebアプリです。  
本プロジェクトは **AI駆動開発（開発プロセスにのみAIを活用）** によって構築されています。

---

## 概要

このアプリは、個人の資産状況を可視化し、日々の収支や保有資産を一元管理するためのWebアプリです。

記録・可視化・分析をシンプルに行えることを目的としています。

---

## 目的

- 家計簿と資産管理を一元化する
- シンプルで使いやすいUIを提供する
- 実務レベルの設計・実装を行うポートフォリオを構築する
- AIを活用した効率的な開発プロセスを実践する

---

## 主な機能（予定含む）

- ユーザー登録 / ログイン
- 収支の登録、編集、削除
- カテゴリ管理
- 保有資産の登録、編集、削除
- 月次 / 年次レポート表示
- グラフによる可視化

※ 本アプリでは、AIによる分析や提案機能は実装しません。

---

## 技術スタック

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS

### Backend
- FastAPI
- Python

### Database
- MySQL

### Infrastructure / Environment
- Docker
- Docker Compose

### Authentication
- JWT Authentication

### Development
- ESLint
- Prettier
- Ruff
- Black

---

## アーキテクチャ

Frontend: Next.js / TypeScript / Tailwind CSS  
Backend: FastAPI / Python  
Database: MySQL  

---

## ディレクトリ構成（例）

asset-management-app/
├── frontend/
├── backend/
├── db/
├── docker-compose.yml
└── README.md

---

## セットアップ

git clone https://github.com/your-name/asset-management-app.git  
cd asset-management-app  
docker compose up -d --build  

---

## 開発方針（AI駆動開発）

本プロジェクトでは、AIを以下の用途に限定して使用します。

### 使用用途
- 要件整理の補助
- 設計レビュー
- 実装のたたき台生成
- テスト観点の洗い出し
- ドキュメント作成補助

### 使用しない用途
- プロダクト機能としてのAI利用（例：分析・提案・自動判断など）

---

## 今後の実装予定

- [ ] 認証機能
- [ ] 収支管理機能
- [ ] 資産管理機能
- [ ] ダッシュボード
- [ ] グラフ表示
- [ ] UI改善
- [ ] 本番デプロイ

---

## 開発者

Masaki

---

## License

MIT
