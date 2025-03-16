from fastapi import FastAPI
from decimal import Decimal
import psycopg2

app = FastAPI()

# Database Connection
DB_HOST = "fundding-app-db.czwki4uyytul.us-east-2.rds.amazonaws.com"
DB_NAME = "funding_app_db"
DB_USER = "fundding_db"
DB_PASS = "fundding181733"
DB_PORT = "5432"

conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASS,
    host=DB_HOST,
    port=DB_PORT
)

cursor = conn.cursor()

# 📌 Home Endpoint
@app.get("/")
def home():
    return {"message": "Funding API is running with financial features!"}

# 📌 Get Total Funds Summary
@app.get("/funds/summary")
def funds_summary():
    cursor.execute("SELECT SUM(amount) FROM funds")
    total_funds = cursor.fetchone()[0] or 0
    return {"total_funds": total_funds}

# 📌 Calculate Interest (Simple & Compound)
from decimal import Decimal


@app.post("/funds/calculate_interest")
def calculate_interest(principal: float, rate: float, time: int, compound: bool = False):
    if compound:
        interest = principal * ((1 + (rate / 100)) ** time - 1)
    else:
        interest = (principal * rate * time) / 100

    return {
        "principal": principal,
        "rate": rate,
        "time": time,
        "interest": interest
    }

# 📌 Profit Calculation (Assuming 10% Profit on Total Funds)
@app.get("/funds/profit")
def calculate_profit():
    try:
        cursor.execute("SELECT SUM(amount) FROM funds")
        result = cursor.fetchone()
        total_funds = result[0] if result and result[0] else 0  # Fixing None case
        profit = round(total_funds * 0.10, 2)  # Rounds profit to 2 decimal places
  # Assuming 10% return on investments

        return {
            "total_funds": total_funds,
            "estimated_profit": profit
        }

    except Exception as e:
        return {"error": str(e)}


# 📌 Generate Financial Analysis Report
@app.get("/funds/generate_analysis")
def generate_analysis():
    cursor.execute("SELECT source, amount, received_date FROM funds")
    funds_data = cursor.fetchall()
    report = {
        "total_funds": sum([fund[1] for fund in funds_data]),
        "funds_count": len(funds_data),
        "average_fund": sum([fund[1] for fund in funds_data]) / len(funds_data) if funds_data else 0,
        "recent_fund": funds_data[-1] if funds_data else None
    }
    return report
