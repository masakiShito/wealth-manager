from datetime import datetime

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    asset_accounts = relationship("AssetAccount", back_populates="user")
    monthly_cashflows = relationship("MonthlyCashflow", back_populates="user")
    retirement_profiles = relationship("RetirementProfile", back_populates="user")
    investment_plans = relationship("InvestmentPlan", back_populates="user")
    simulation_results = relationship("SimulationResult", back_populates="user")
