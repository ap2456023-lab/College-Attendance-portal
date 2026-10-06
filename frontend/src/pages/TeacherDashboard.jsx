import React from "react";
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";


export default function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");   
  };
  const  gotoSelectCourse = () => {
    navigate("/SelectCourse");   
  };

  return (
    <div className="dashboard-wrapper">
      <div class="page-contain">
      <div className="dashboard-box">

        <h1 className="dashboard-title">Teacher Dashboard</h1>

        <hr className="divider" />

        <div className="button-row">
          <button className="btn" onClick={() => navigate("/select-course")}>📄 Mark Attendance</button>
          <button className="btn" onClick={() => navigate("/student-data")}>📄 Student Directory</button>
          <button className="btn" onClick={() => navigate("/view-reports")}>📊 Attendance Reports</button>
          <button className="btn" onClick={() => navigate("/add-student")}>➕ Add New Student</button>

          <button className="btn logout" onClick={handleLogout}>Logout</button>

        </div>

      </div>
      </div>
    </div>
    
  );
}
