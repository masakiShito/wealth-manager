from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cashflow import MonthlyCashflow
from app.schemas.cashflow import MonthlyCashflowCreate, MonthlyCashflowUpdate


def get_cashflows(db: Session, user_id: int) -> list[MonthlyCashflow]:
    return (
        db.query(MonthlyCashflow)
        .filter(MonthlyCashflow.user_id == user_id)
        .order_by(MonthlyCashflow.year_month.desc())
        .all()
    )


def create_cashflow(db: Session, user_id: int, data: MonthlyCashflowCreate) -> MonthlyCashflow:
    existing = (
        db.query(MonthlyCashflow)
        .filter(
            MonthlyCashflow.user_id == user_id,
            MonthlyCashflow.year_month == data.year_month,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="この月の収支は既に登録されています",
        )
    cashflow = MonthlyCashflow(
        user_id=user_id,
        year_month=data.year_month,
        income=data.income,
        expense=data.expense,
        savings=data.savings,
    )
    db.add(cashflow)
    db.commit()
    db.refresh(cashflow)
    return cashflow


def update_cashflow(
    db: Session, user_id: int, cashflow_id: int, data: MonthlyCashflowUpdate
) -> MonthlyCashflow:
    cashflow = (
        db.query(MonthlyCashflow)
        .filter(MonthlyCashflow.id == cashflow_id, MonthlyCashflow.user_id == user_id)
        .first()
    )
    if not cashflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="収支データが見つかりません",
        )
    if data.income is not None:
        cashflow.income = data.income
    if data.expense is not None:
        cashflow.expense = data.expense
    if data.savings is not None:
        cashflow.savings = data.savings
    db.commit()
    db.refresh(cashflow)
    return cashflow


def delete_cashflow(db: Session, user_id: int, cashflow_id: int) -> None:
    cashflow = (
        db.query(MonthlyCashflow)
        .filter(MonthlyCashflow.id == cashflow_id, MonthlyCashflow.user_id == user_id)
        .first()
    )
    if not cashflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="収支データが見つかりません",
        )
    db.delete(cashflow)
    db.commit()
