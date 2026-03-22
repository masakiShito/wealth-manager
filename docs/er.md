# ER図・テーブル設計

## 概要

老後資産シミュレーションを目的とした資産管理アプリのデータベース設計。

## テーブル一覧

| テーブル名 | 説明 |
|---|---|
| users | ユーザー情報 |
| asset_types | 資産種別マスタ（預金、株式、投資信託など） |
| asset_accounts | 資産口座（銀行口座、証券口座など） |
| asset_snapshots | 資産残高のスナップショット（月次記録） |
| monthly_cashflows | 月次収支（収入・支出・積立額） |
| retirement_profiles | 老後条件プロファイル |
| investment_plans | 積立・投資プラン |
| simulation_results | シミュレーション結果 |

## ER図（概要）

```
users
  │
  ├── asset_accounts ──── asset_types
  │       │
  │       └── asset_snapshots
  │
  ├── monthly_cashflows
  │
  ├── retirement_profiles
  │
  ├── investment_plans
  │
  └── simulation_results
```

## テーブル詳細（初期設計）

### users
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | ユーザーID |
| email | VARCHAR(255) | メールアドレス |
| hashed_password | VARCHAR(255) | ハッシュ化パスワード |
| name | VARCHAR(100) | 表示名 |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### asset_types
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | 資産種別ID |
| name | VARCHAR(50) | 種別名（預金、株式、投資信託など） |
| category | VARCHAR(50) | カテゴリ（現金、投資、不動産など） |

### asset_accounts
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | 口座ID |
| user_id | INT (FK) | ユーザーID |
| asset_type_id | INT (FK) | 資産種別ID |
| name | VARCHAR(100) | 口座名 |
| institution | VARCHAR(100) | 金融機関名 |
| created_at | DATETIME | 作成日時 |

### asset_snapshots
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | スナップショットID |
| account_id | INT (FK) | 口座ID |
| balance | DECIMAL(15,2) | 残高 |
| snapshot_date | DATE | 記録日 |
| created_at | DATETIME | 作成日時 |

### monthly_cashflows
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | 収支ID |
| user_id | INT (FK) | ユーザーID |
| year_month | DATE | 対象年月 |
| income | DECIMAL(12,2) | 月収入 |
| expense | DECIMAL(12,2) | 月支出 |
| savings | DECIMAL(12,2) | 積立可能額 |
| created_at | DATETIME | 作成日時 |

### retirement_profiles
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | プロファイルID |
| user_id | INT (FK) | ユーザーID |
| current_age | INT | 現在の年齢 |
| retirement_age | INT | 退職予定年齢 |
| life_expectancy | INT | 想定寿命 |
| monthly_living_cost | DECIMAL(12,2) | 老後の月額生活費 |
| expected_pension | DECIMAL(12,2) | 年金見込み月額 |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### investment_plans
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | プランID |
| user_id | INT (FK) | ユーザーID |
| name | VARCHAR(100) | プラン名 |
| monthly_amount | DECIMAL(12,2) | 月額積立額 |
| expected_return_rate | DECIMAL(5,2) | 想定年利（%） |
| created_at | DATETIME | 作成日時 |

### simulation_results
| カラム | 型 | 説明 |
|---|---|---|
| id | INT (PK) | 結果ID |
| user_id | INT (FK) | ユーザーID |
| profile_id | INT (FK) | 老後プロファイルID |
| total_assets_at_retirement | DECIMAL(15,2) | 退職時の想定総資産 |
| total_needed | DECIMAL(15,2) | 老後に必要な総額 |
| surplus_or_deficit | DECIMAL(15,2) | 過不足額 |
| simulated_at | DATETIME | シミュレーション実行日時 |
