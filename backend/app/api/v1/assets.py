from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.asset import (
    AssetTypeCreate,
    AssetTypeResponse,
    AssetAccountCreate,
    AssetAccountUpdate,
    AssetAccountResponse,
)
from app.services.asset import (
    get_asset_types,
    create_asset_type,
    get_asset_accounts,
    create_asset_account,
    update_asset_account,
    delete_asset_account,
)

router = APIRouter(prefix="/assets")


@router.get("/types", response_model=list[AssetTypeResponse])
def list_asset_types(db: Session = Depends(get_db)):
    return get_asset_types(db)


@router.post("/types", response_model=AssetTypeResponse, status_code=201)
def add_asset_type(
    data: AssetTypeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_asset_type(db, data)


@router.get("/accounts", response_model=list[AssetAccountResponse])
def list_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_asset_accounts(db, current_user.id)


@router.post("/accounts", response_model=AssetAccountResponse, status_code=201)
def add_account(
    data: AssetAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_asset_account(db, current_user.id, data)


@router.patch("/accounts/{account_id}", response_model=AssetAccountResponse)
def edit_account(
    account_id: int,
    data: AssetAccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_asset_account(db, current_user.id, account_id, data)


@router.delete("/accounts/{account_id}", status_code=204)
def remove_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_asset_account(db, current_user.id, account_id)
