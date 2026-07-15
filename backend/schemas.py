from pydantic import BaseModel
from datetime import date

# ==========================================
# USER
# ==========================================

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    income: float
    expenses: float


class UserLogin(BaseModel):
    email: str
    password: str


# ==========================================
# LOAN
# ==========================================

class LoanCreate(BaseModel):
    user_id: int

    lender: str

    loan_type: str

    outstanding: float

    emi: float

    overdue: int

    # NEW FIELDS

    start_date: date

    end_date: date

    duration_months: int

    interest_rate: float

    recommended_emi: float

    expected_closure_date: date


class LoanResponse(BaseModel):

    id: int

    user_id: int

    lender: str

    loan_type: str

    outstanding: float

    emi: float

    overdue: int

    start_date: date

    end_date: date

    duration_months: int

    interest_rate: float

    recommended_emi: float

    expected_closure_date: date

    class Config:
        from_attributes = True