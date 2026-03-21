-- 初期化SQL
-- テーブルはアプリケーション側のマイグレーションで管理する想定
-- ここでは文字コード設定のみ行う

ALTER DATABASE wealth_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
