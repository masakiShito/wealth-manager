from datetime import datetime, date
from decimal import Decimal

from sqlalchemy import DateTime, Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class MonthlyCashflow(Base):
    __tablename__ = "monthly_cashflows"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    year_month: Mapped[date] = mapped_column(Date, nullable=False)
    income: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    expense: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    savings: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="monthly_cashflows")
