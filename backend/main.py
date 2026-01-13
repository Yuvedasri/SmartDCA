from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

# CORS middleware to allow React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
cases_db: List[Dict] = []
dca_assignments: Dict[int, List[Dict]] = {1: []}

# Pydantic models
class CaseCreate(BaseModel):
    customer_name: str
    amount: float
    days_overdue: int

# Root endpoint
@app.get("/")
def root():
    return {"status": "SmartDCA backend running"}

# Admin Dashboard endpoint
@app.get("/admin/dashboard")
def admin_dashboard():
    active_cases = len(cases_db)
    resolved_today = len([c for c in cases_db if c.get("resolved", False)])
    
    return {
        "total_dcas": 5,
        "active_cases": active_cases,
        "resolved_today": resolved_today
    }

# Create case endpoint
@app.post("/admin/case")
def create_case(case: CaseCreate):
    new_case = {
        "id": len(cases_db) + 1,
        "customer_name": case.customer_name,
        "amount": case.amount,
        "days_overdue": case.days_overdue,
        "status": "active",
        "resolved": False
    }
    cases_db.append(new_case)
    
    # Assign to DCA 1 for demo
    if 1 not in dca_assignments:
        dca_assignments[1] = []
    dca_assignments[1].append(new_case)
    
    return {
        "message": "Case created successfully",
        "case": new_case
    }

# DCA Dashboard endpoint
@app.get("/dca/{dca_id}/dashboard")
def dca_dashboard(dca_id: int):
    assigned = dca_assignments.get(dca_id, [])
    
    # Format cases for display
    case_list = [
        f"{c['customer_name']} - ${c['amount']:.2f} ({c['days_overdue']} days overdue)"
        for c in assigned
    ]
    
    return {
        "dca_id": dca_id,
        "message": f"Welcome, DCA Agent #{dca_id}",
        "assigned_cases": case_list
    }
