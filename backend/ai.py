import os
from dotenv import load_dotenv
from google import genai

# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)

# ==========================================
# AI NEGOTIATION
# ==========================================

def generate_negotiation(
    lender,
    outstanding,
    emi,
    income,
    expenses,
    overdue
):

    prompt = f"""
You are an experienced financial advisor and debt settlement expert.

Analyze the following borrower's financial situation and generate a professional response.

Borrower Information

Lender: {lender}

Outstanding Amount: ₹{outstanding}

Monthly EMI: ₹{emi}

Monthly Income: ₹{income}

Monthly Expenses: ₹{expenses}

Overdue Months: {overdue}

Generate the response in the following format:

1. Financial Health Analysis

2. Debt Risk Level

3. Recommended Settlement Percentage

4. Recommended Monthly EMI

5. Tips to Improve Financial Health

6. Professional Debt Negotiation Letter addressed to the lender.

The response should be clear, professional, and suitable for a bank.
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        return f"AI Generation Failed.\n\nError: {str(e)}"