# ER図・テーブル設計

## 概要

老後資産シミュレーションを目的とした資産管理アプリのデータベース設計です。

現在は初期土台の段階であり、テーブルは未作成です。今後の開発で順次追加・変更していく予定です。

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

## ER図

```mermaid
erDiagram
    users ||--o{ asset_accounts : "has"
    users ||--o{ monthly_cashflows : "has"
    users ||--o{ retirement_profiles : "has"
    users ||--o{ investment_plans : "has"
    users ||--o{ simulation_results : "has"
    asset_types ||--o{ asset_accounts : "categorizes"
    asset_accounts ||--o{ asset_snapshots : "has"
    retirement_profiles ||--o{ simulation_results : "used_in"

    users {
        int id PK
        varchar email
        varchar hashed_password
        varchar name
        datetime created_at
        datetime updated_at
    }

    asset_types {
        int id PK
        varchar name
        varchar category
    }

    asset_accounts {
        int id PK
        int user_id FK
        int asset_type_id FK
        varchar name
        varchar institution
        datetime created_at
    }

    asset_snapshots {
        int id PK
        int account_id FK
        decimal balance
        date snapshot_date
        datetime created_at
    }

    monthly_cashflows {
        int id PK
        int user_id FK
        date year_month
        decimal income
        decimal expense
        decimal savings
        datetime created_at
    }

    retirement_profiles {
        int id PK
        int user_id FK
        int current_age
        int retirement_age
        int life_expectancy
        decimal monthly_living_cost
        decimal expected_pension
        datetime created_at
        datetime updated_at
    }

    investment_plans {
        int id PK
        int user_id FK
        varchar name
        decimal monthly_amount
        decimal expected_return_rate
        datetime created_at
    }

    simulation_results {
        int id PK
        int user_id FK
        int profile_id FK
        decimal total_assets_at_retirement
        decimal total_needed
        decimal surplus_or_deficit
        datetime simulated_at
    }
```

## 備考

- この設計は初期段階のものであり、今後の開発に応じて変更される可能性があります
- マイグレーションは将来 Alembic で管理する予定です
- テーブル間のリレーションは上記 ER 図を基本としますが、要件に応じて調整します
