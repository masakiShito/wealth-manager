from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, DateTime, ForeignKey, Numeric, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class RetirementProfile(Base):
    __tablename__ = "retirement_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    current_age: Mapped[int] = mapped_column(Integer, nullable=False)
    retirement_age: Mapped[int] = mapped_column(Integer, nullable=False)
    life_expectancy: Mapped[int] = mapped_column(Integer, nullable=False)
    monthly_living_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    expected_pension: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User", back_populates="retirement_profiles")
    simulation_results = relationship("SimulationResult", back_populates="profile")


class InvestmentPlan(Base):
    __tablename__ = "investment_plans"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    monthly_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    expected_return_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="investment_plans")


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    profile_id: Mapped[int] = mapped_column(ForeignKey("retirement_profiles.id"), nullable=False)
    total_assets_at_retirement: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    total_needed: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    surplus_or_deficit: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    simulated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="simulation_results")
    profile = relationship("RetirementProfile", back_populates="simulation_results")
