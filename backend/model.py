import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def predict_dropout(attendance: float, sem1_cgpa: float, sem2_cgpa: float, fee_paid: int):
    """
    Predicts dropout probability based on 4 key features.
    
    Weights (simplified/heuristic):
    - Attendance: 40% influence
    - Academic (Sem1 + Sem2): 40% influence 
    - Fee Status: 20% influence
    """
    
    # 1. Attendance Score (Lower is higher risk)
    # Range 0-100. Ideal is 85+. High risk below 60.
    att_score = 1.0 - (attendance / 100.0)
    # Boost risk if attendance is critically low
    if attendance < 60:
        att_score *= 1.5
    
    # 2. Academic Score (Lower CGPA is higher risk)
    # Range 0-10. Ideal is 7+. High risk below 4.
    avg_cgpa = (sem1_cgpa + sem2_cgpa) / 2.0
    acad_score = 1.0 - (avg_cgpa / 10.0)
    # Penalize declining performance
    if sem2_cgpa < sem1_cgpa:
        acad_score += 0.1
    
    # 3. Financial Score (0 = Unpaid, 1 = Paid)
    fee_score = 1.0 if fee_paid == 0 else 0.0

    # Weighted Sum (Linear Predictor)
    # Base risk starts at -2 (to make default prob low)
    z = -3.5 + (att_score * 4.5) + (acad_score * 4.0) + (fee_score * 3.5)
    
    probability = float(sigmoid(z))
    
    # Determine risk level
    if probability < 0.3:
        risk_level = "Low"
        label = "Graduate"
    elif probability < 0.6:
        risk_level = "Moderate"
        label = "Graduate"
    elif probability < 0.85:
        risk_level = "High"
        label = "Dropout"
    else:
        risk_level = "Critical"
        label = "Dropout"

    return {
        "prediction": label,
        "probability": probability,
        "risk_level": risk_level,
        "factors": {
            "attendance": float(min(att_score, 1.0)),
            "academic": float(min(acad_score, 1.0)),
            "financial": float(fee_score)
        }
    }
