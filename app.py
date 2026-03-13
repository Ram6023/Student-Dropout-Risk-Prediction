import streamlit as st

st.title("🎓 Student Dropout Risk Prediction")

# Attendance
st.header("👤 Attendance")

attendance = st.slider("Attendance (%)", 0, 100, 75)

# Semester results
st.header("📚 Semester Results")

sem1 = st.slider("Semester 1 Grade", 0, 100, 60)
sem2 = st.slider("Semester 2 Grade", 0, 100, 60)

# Financial information
st.header("💰 Financial Status")

fees = st.selectbox("Tuition Fees Status", ["Paid", "Not Paid"])

# Prediction
if st.button("Predict Dropout Risk"):

    if attendance < 50 or sem1 < 40 or sem2 < 40 or fees == "Not Paid":
        st.error("⚠ High Dropout Risk")
    else:
        st.success("✅ Low Dropout Risk")