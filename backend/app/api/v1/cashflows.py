from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.cashflow import (
    MonthlyCashflowCreate,
    MonthlyCashflowUpdate,
    MonthlyCashflowResponse,
)
from app.services.cashflow import (
    get_cashflows,
    create_cashflow,
    update_cashflow,
    delete_cashflow,
)

router = APIRouter(prefix="/cashflows")


@router.get("", response_model=list[MonthlyCashflowResponse])
def list_cashflows(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_cashflows(db, current_user.id)


@router.post("", response_model=MonthlyCashflowResponse, status_code=201)
def add_cashflow(
    data: MonthlyCashflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_cashflow(db, current_user.id, data)


@router.patch("/{cashflow_id}", response_model=MonthlyCashflowResponse)
def edit_cashflow(
    cashflow_id: int,
    data: MonthlyCashflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_cashflow(db, current_user.id, cashflow_id, data)


@router.delete("/{cashflow_id}", status_code=204)
def remove_cashflow(
    cashflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_cashflow(db, current_user.id, cashflow_id)
