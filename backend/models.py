from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


# -----------------------------
# User Table
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password = Column(String(200), nullable=False)

    income = Column(Float, default=0)

    expenses = Column(Float, default=0)

    loans = relationship("Loan", back_populates="user")


# -----------------------------
# Loan Table
# -----------------------------
class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)

    lender = Column(String(100))

    loan_type = Column(String(100))

    outstanding = Column(Float)

    emi = Column(Float)

    overdue = Column(Integer)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="loans")


# -----------------------------
# AI History
# -----------------------------
class AIHistory(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)

    loan_id = Column(Integer)

    strategy = Column(String)

    letter = Column(String)