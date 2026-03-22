from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.asset import AssetType, AssetAccount
from app.schemas.asset import AssetTypeCreate, AssetAccountCreate, AssetAccountUpdate


def get_asset_types(db: Session) -> list[AssetType]:
    return db.query(AssetType).all()


def create_asset_type(db: Session, data: AssetTypeCreate) -> AssetType:
    existing = db.query(AssetType).filter(AssetType.name == data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="この資産種別は既に存在します",
        )
    asset_type = AssetType(name=data.name, category=data.category)
    db.add(asset_type)
    db.commit()
    db.refresh(asset_type)
    return asset_type


def get_asset_accounts(db: Session, user_id: int) -> list[AssetAccount]:
    return db.query(AssetAccount).filter(AssetAccount.user_id == user_id).all()


def create_asset_account(db: Session, user_id: int, data: AssetAccountCreate) -> AssetAccount:
    asset_type = db.query(AssetType).filter(AssetType.id == data.asset_type_id).first()
    if not asset_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="指定された資産種別が存在しません",
        )
    account = AssetAccount(
        user_id=user_id,
        asset_type_id=data.asset_type_id,
        name=data.name,
        institution=data.institution,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def update_asset_account(
    db: Session, user_id: int, account_id: int, data: AssetAccountUpdate
) -> AssetAccount:
    account = (
        db.query(AssetAccount)
        .filter(AssetAccount.id == account_id, AssetAccount.user_id == user_id)
        .first()
    )
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="口座が見つかりません",
        )
    if data.name is not None:
        account.name = data.name
    if data.institution is not None:
        account.institution = data.institution
    db.commit()
    db.refresh(account)
    return account


def delete_asset_account(db: Session, user_id: int, account_id: int) -> None:
    account = (
        db.query(AssetAccount)
        .filter(AssetAccount.id == account_id, AssetAccount.user_id == user_id)
        .first()
    )
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="口座が見つかりません",
        )
    db.delete(account)
    db.commit()
