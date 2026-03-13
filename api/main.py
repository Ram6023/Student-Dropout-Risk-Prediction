from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from api.model import predict_dropout
import pandas as pd
import io
import json

app = FastAPI(
    title="Student Dropout Risk Prediction API",
    description="ML-powered prediction of student dropout probability.",
    version="1.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    attendance: float = Field(..., ge=0, le=100)
    sem1_cgpa: float = Field(..., ge=0, le=10)
    sem2_cgpa: float = Field(..., ge=0, le=10)
    fee_paid: int = Field(..., ge=0, le=1)

@app.post("/predict")
async def predict(data: StudentData):
    try:
        return predict_dropout(data.attendance, data.sem1_cgpa, data.sem2_cgpa, data.fee_paid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-csv")
async def predict_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Required columns mapping (case-insensitive)
        required = {'attendance', 'sem1_cgpa', 'sem2_cgpa', 'fee_paid'}
        cols = {c.lower(): c for c in df.columns}
        
        if not required.issubset(set(cols.keys())):
            missing = required - set(cols.keys())
            raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing)}")

        results = []
        for _, row in df.iterrows():
            pred = predict_dropout(
                float(row[cols['attendance']]),
                float(row[cols['sem1_cgpa']]),
                float(row[cols['sem2_cgpa']]),
                int(row[cols['fee_paid']])
            )
            res_row = row.to_dict()
            res_row.update({
                "dropout_probability": f"{round(pred['probability'] * 100, 1)}%",
                "risk_level": pred['risk_level'],
                "recommendation": pred['prediction']
            })
            results.append(res_row)

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV Processing error: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "healthy"}
