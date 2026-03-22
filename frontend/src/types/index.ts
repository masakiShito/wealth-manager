export interface HealthResponse {
  status: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AssetType {
  id: number;
  name: string;
  category: string;
}

export interface AssetAccount {
  id: number;
  user_id: number;
  asset_type_id: number;
  name: string;
  institution: string;
  created_at: string;
  asset_type: AssetType;
}

export interface Cashflow {
  id: number;
  user_id: number;
  year_month: string;
  income: string;
  expense: string;
  savings: string;
  created_at: string;
}
