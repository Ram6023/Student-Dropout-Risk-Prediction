"""
FastAPI Backend — Student Dropout Risk Prediction
---------------------------------------------------
POST /predict  →  accepts 4 features, returns risk prediction.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from model import predict_dropout

app = FastAPI(
    title="Student Dropout Risk Prediction API",
    description="ML-powered prediction of student dropout probability.",
    version="1.0.0",
)

# ── CORS — allow the React frontend at localhost:5173 ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request schema ──
class StudentData(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage (0–100)")
    sem1_cgpa: float = Field(..., ge=0, le=10, description="Semester 1 CGPA (0–10)")
    sem2_cgpa: float = Field(..., ge=0, le=10, description="Semester 2 CGPA (0–10)")
    fee_paid: int = Field(..., ge=0, le=1, description="Fee paid: 1 = Yes, 0 = No")


# ── Prediction endpoint ──
@app.post("/predict")
async def predict(data: StudentData):
    try:
        result = predict_dropout(
            attendance=data.attendance,
            sem1_cgpa=data.sem1_cgpa,
            sem2_cgpa=data.sem2_cgpa,
            fee_paid=data.fee_paid,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# ── Health check ──
@app.get("/")
async def root():
    return {"status": "ok", "message": "Student Dropout Prediction API is running."}


@app.get("/health")
async def health():
    return {"status": "healthy"}
