from datetime import datetime

from pydantic import BaseModel


class AssetTypeCreate(BaseModel):
    name: str
    category: str


class AssetTypeResponse(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}


class AssetAccountCreate(BaseModel):
    asset_type_id: int
    name: str
    institution: str


class AssetAccountUpdate(BaseModel):
    name: str | None = None
    institution: str | None = None


class AssetAccountResponse(BaseModel):
    id: int
    user_id: int
    asset_type_id: int
    name: str
    institution: str
    created_at: datetime
    asset_type: AssetTypeResponse

    model_config = {"from_attributes": True}
