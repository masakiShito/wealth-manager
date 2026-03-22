from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class MonthlyCashflowCreate(BaseModel):
    year_month: date
    income: Decimal
    expense: Decimal
    savings: Decimal


class MonthlyCashflowUpdate(BaseModel):
    income: Decimal | None = None
    expense: Decimal | None = None
    savings: Decimal | None = None


class MonthlyCashflowResponse(BaseModel):
    id: int
    user_id: int
    year_month: date
    income: Decimal
    expense: Decimal
    savings: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}
