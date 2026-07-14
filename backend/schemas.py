from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    income: float
    expenses: float


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LoanCreate(BaseModel):
    user_id: int
    lender: str
    loan_type: str
    outstanding: float
    emi: float
    overdue: int