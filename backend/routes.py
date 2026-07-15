from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import get_db
from models import User, Loan, AIHistory
from schemas import UserRegister, UserLogin, LoanCreate
from ai import generate_negotiation

router = APIRouter()

# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=user.password,
        income=user.income,
        expenses=user.expenses
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.id
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email,
        User.password == user.password
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    return {
        "message": "Login Successful",
        "user_id": db_user.id,
        "name": db_user.name
    }


# ==========================================
# ADD LOAN
# ==========================================

@router.post("/loan")
def add_loan(loan: LoanCreate, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == loan.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    monthly_surplus = user.income - user.expenses

    recommended_emi = round(monthly_surplus * 0.70, 2)

    if recommended_emi <= 0:
        recommended_emi = loan.emi

    duration_months = (
        (loan.end_date.year - loan.start_date.year) * 12 +
        (loan.end_date.month - loan.start_date.month)
    )

    if duration_months <= 0:
        duration_months = 1

    expected_closure_date = datetime.today() + timedelta(days=duration_months * 30)

    new_loan = Loan(
        user_id=loan.user_id,
        lender=loan.lender,
        loan_type=loan.loan_type,
        outstanding=loan.outstanding,
        emi=loan.emi,
        overdue=loan.overdue,
        start_date=loan.start_date,
        end_date=loan.end_date,
        duration_months=duration_months,
        interest_rate=loan.interest_rate,
        recommended_emi=recommended_emi,
        expected_closure_date=expected_closure_date.date()
    )

    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)

    return {
        "message": "Loan Added Successfully",
        "loan_id": new_loan.id,
        "recommended_emi": recommended_emi,
        "duration_months": duration_months,
        "expected_closure_date": expected_closure_date.date()
    }
    # ==========================================
# VIEW ALL LOANS
# ==========================================

@router.get("/loans")
def view_loans(db: Session = Depends(get_db)):

    loans = db.query(Loan).all()

    result = []

    for loan in loans:

        result.append({

            "loan_id": loan.id,

            "user_id": loan.user_id,

            "lender": loan.lender,

            "loan_type": loan.loan_type,

            "outstanding": loan.outstanding,

            "emi": loan.emi,

            "overdue_months": loan.overdue,

            "start_date": loan.start_date,

            "end_date": loan.end_date,

            "duration_months": loan.duration_months,

            "interest_rate": loan.interest_rate,

            "recommended_emi": loan.recommended_emi,

            "expected_closure_date": loan.expected_closure_date

        })

    return result


# ==========================================
# VIEW SINGLE LOAN
# ==========================================

@router.get("/loan/{loan_id}")
def single_loan(
    loan_id: int,
    db: Session = Depends(get_db)
):

    loan = db.query(Loan).filter(
        Loan.id == loan_id
    ).first()

    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    return {

        "loan_id": loan.id,

        "user_id": loan.user_id,

        "lender": loan.lender,

        "loan_type": loan.loan_type,

        "outstanding": loan.outstanding,

        "emi": loan.emi,

        "overdue_months": loan.overdue,

        "start_date": loan.start_date,

        "end_date": loan.end_date,

        "duration_months": loan.duration_months,

        "interest_rate": loan.interest_rate,

        "recommended_emi": loan.recommended_emi,

        "expected_closure_date": loan.expected_closure_date

    }


# ==========================================
# UPDATE LOAN
# ==========================================

@router.put("/loan/{loan_id}")
def update_loan(
    loan_id: int,
    loan: LoanCreate,
    db: Session = Depends(get_db)
):

    db_loan = db.query(Loan).filter(
        Loan.id == loan_id
    ).first()

    if not db_loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    user = db.query(User).filter(
        User.id == loan.user_id
    ).first()

    monthly_surplus = user.income - user.expenses

    recommended_emi = round(monthly_surplus * 0.70, 2)

    if recommended_emi <= 0:
        recommended_emi = loan.emi

    duration_months = (
        (loan.end_date.year - loan.start_date.year) * 12 +
        (loan.end_date.month - loan.start_date.month)
    )

    if duration_months <= 0:
        duration_months = 1

    expected_closure = datetime.today() + timedelta(days=duration_months * 30)

    db_loan.user_id = loan.user_id
    db_loan.lender = loan.lender
    db_loan.loan_type = loan.loan_type
    db_loan.outstanding = loan.outstanding
    db_loan.emi = loan.emi
    db_loan.overdue = loan.overdue

    db_loan.start_date = loan.start_date
    db_loan.end_date = loan.end_date

    db_loan.duration_months = duration_months

    db_loan.interest_rate = loan.interest_rate

    db_loan.recommended_emi = recommended_emi

    db_loan.expected_closure_date = expected_closure.date()

    db.commit()

    return {

        "message": "Loan Updated Successfully"

    }


# ==========================================
# DELETE LOAN
# ==========================================

@router.delete("/loan/{loan_id}")
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db)
):

    loan = db.query(Loan).filter(
        Loan.id == loan_id
    ).first()

    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    db.delete(loan)

    db.commit()

    return {

        "message": "Loan Deleted Successfully"

    }
    # ==========================================
# FINANCIAL ANALYSIS
# ==========================================

@router.get("/analysis/{user_id}")
def financial_analysis(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    loans = db.query(Loan).filter(
        Loan.user_id == user_id
    ).all()

    total_outstanding = sum(
        loan.outstanding for loan in loans
    )

    total_emi = sum(
        loan.emi for loan in loans
    )

    monthly_surplus = user.income - user.expenses

    debt_ratio = 0

    if user.income > 0:
        debt_ratio = round(
            (total_emi / user.income) * 100,
            2
        )

    recommended_emi = round(monthly_surplus * 0.70, 2)

    if recommended_emi <= 0:
        recommended_emi = total_emi

    estimated_months = 0

    if recommended_emi > 0:
        estimated_months = round(
            total_outstanding / recommended_emi
        )

    estimated_closure = (
        datetime.today() +
        timedelta(days=estimated_months * 30)
    )

    if debt_ratio >= 60:
        settlement = 40
        stress = "High"

    elif debt_ratio >= 40:
        settlement = 55
        stress = "Medium"

    else:
        settlement = 70
        stress = "Low"

    return {

        "monthly_income": user.income,

        "monthly_expenses": user.expenses,

        "monthly_surplus": monthly_surplus,

        "total_outstanding": total_outstanding,

        "total_emi": total_emi,

        "recommended_emi": recommended_emi,

        "estimated_months": estimated_months,

        "estimated_closure_date": estimated_closure.date(),

        "debt_ratio": debt_ratio,

        "stress_level": stress,

        "recommended_settlement_percent": settlement

    }


# ==========================================
# DASHBOARD
# ==========================================

@router.get("/dashboard/{user_id}")
def dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    loans = db.query(Loan).filter(
        Loan.user_id == user_id
    ).all()

    total_loans = len(loans)

    total_outstanding = sum(
        loan.outstanding for loan in loans
    )

    total_emi = sum(
        loan.emi for loan in loans
    )

    return {

        "name": user.name,

        "income": user.income,

        "expenses": user.expenses,

        "total_loans": total_loans,

        "total_outstanding": total_outstanding,

        "total_emi": total_emi

    }


# ==========================================
# AI NEGOTIATION LETTER
# ==========================================

@router.post("/generate-letter/{loan_id}")
def generate_letter(
    loan_id: int,
    db: Session = Depends(get_db)
):

    loan = db.query(Loan).filter(
        Loan.id == loan_id
    ).first()

    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    user = db.query(User).filter(
        User.id == loan.user_id
    ).first()

    response = generate_negotiation(

        lender=loan.lender,

        outstanding=loan.outstanding,

        emi=loan.emi,

        income=user.income,

        expenses=user.expenses,

        overdue=loan.overdue

    )

    history = AIHistory(

        loan_id=loan.id,

        strategy="AI Negotiation Strategy",

        letter=response

    )

    db.add(history)

    db.commit()

    return {

        "loan_id": loan.id,

        "ai_letter": response

    }


# ==========================================
# AI HISTORY
# ==========================================

@router.get("/history")
def history(
    db: Session = Depends(get_db)
):

    history = db.query(AIHistory).all()

    result = []

    for item in history:

        result.append({

            "id": item.id,

            "loan_id": item.loan_id,

            "strategy": item.strategy,

            "letter": item.letter

        })

    return result
    