import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini Model
model = genai.GenerativeModel("gemini-1.5-flash")


def generate_negotiation(
    lender,
    outstanding,
    emi,
    income,
    expenses,
    overdue
):
    prompt = f"""
You are an expert financial advisor.

Generate a professional debt settlement negotiation strategy.

Borrower Details:

Lender: {lender}

Outstanding Amount: ₹{outstanding}

Monthly EMI: ₹{emi}

Monthly Income: ₹{income}

Monthly Expenses: ₹{expenses}

Overdue Months: {overdue}

Requirements:

1. Analyze financial condition.
2. Suggest an estimated settlement percentage.
3. Explain why settlement is appropriate.
4. Write a professional negotiation letter addressed to the lender.
5. Keep the language formal and polite.
"""

    response = model.generate_content(prompt)

    return response.text