# 🎓 Student Dropout Risk Prediction System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.4.2-emerald.svg)
![Deployment](https://img.shields.io/badge/platform-Vercel-black.svg)

A premium, ML-powered dashboard designed to forecast student dropout risks using key academic and financial metrics. Built with a focus on modern aesthetics, actionable insights, and high-performance data visualization.

---

## ✨ Key Features

- **🚀 Intelligent Risk Forecasting**: Real-time prediction engine analyzing student behavior and performance.
- **📊 Animated Speedometer Gauge**: Visual risk meter with dynamic color-coding and smooth SVG transitions.
- **🔍 Deep Factor Analysis**: Detailed breakdown of exactly *why* a student is at risk (Attendance vs. Academics vs. Financials).
- **💡 Context-Aware Recommendations**: Automated guidance tailored to the highest risk factors identified.
- **🕒 Session History Tracking**: Compare multiple students instantly with a session-persistent history panel.
- **💎 Premium Dashboard Experience**: Clean dark-themed UI with glassmorphism, responsive grid layout, and polished micro-animations.

---

## 🛠️ Tech Stack

### **Frontend**
- **React (Vite)**: High-performance component-based architecture.
- **Tailwind CSS v4**: Ultra-modern styling and responsive layouts.
- **Axios**: Robust API communication with error handling.

### **Backend**
- **FastAPI (Python)**: High-performance asynchronous API framework.
- **Weighted Sigmoid Model**: Sophisticated heuristic-based regression for precise probability output.
- **Pydantic**: Strong data validation and schema enforcement.

---

## 🏗️ How It Works

The system evaluates four critical features to generate a comprehensive risk profile:

1. **Attendance**: 40% weight. Critical threshold below 60%.
2. **Academic Performance (CGPA)**: 40% weight. Analyzes average and performance trends.
3. **Financial Status**: 20% weight. Evaluates impact of outstanding fees.

Each factor is processed through a weighted sigmoid predictor to output a probability percentage and a categorical risk level (**Low**, **Moderate**, **High**, or **Critical**).

---

## 🚀 Installation & Local Development

### **1. Clone the repository**
```bash
git clone https://github.com/Ram6023/Student-Dropout-Risk-Prediction.git
cd Student-Dropout-Risk-Prediction
```

### **2. Setup Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

---

## ☁️ Deployment

This project is optimized for **Vercel** as a monorepo.

1. Connect your GitHub repository to Vercel.
2. Select the `frontend` folder as the **Root Directory**.
3. Vercel will automatically deploy the React app and convert the `api/` folder into serverless functions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed with ❤️ for Advanced Student Success Monitoring.
