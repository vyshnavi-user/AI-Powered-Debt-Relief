from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base


# ==========================================
# USER TABLE
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    email = Column(String, unique=True)

    password = Column(String)

    income = Column(Float)

    expenses = Column(Float)

    loans = relationship("Loan", back_populates="user")


# ==========================================
# LOAN TABLE
# ==========================================

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    lender = Column(String)

    loan_type = Column(String)

    outstanding = Column(Float)

    emi = Column(Float)

    overdue = Column(Integer)

    # NEW FIELDS

    start_date = Column(Date)

    end_date = Column(Date)

    duration_months = Column(Integer)

    interest_rate = Column(Float)

    recommended_emi = Column(Float)

    expected_closure_date = Column(Date)

    user = relationship("User", back_populates="loans")


# ==========================================
# AI HISTORY
# ==========================================

class AIHistory(Base):
    __tablename__ = "ai_history"

    id = Column(Integer, primary_key=True, index=True)

    loan_id = Column(Integer, ForeignKey("loans.id"))

    strategy = Column(String)

    letter = Column(String)