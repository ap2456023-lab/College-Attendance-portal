import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewReports.css";

export default function ViewStudents() {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  const goNext = () => {
    if (!course || !year) {
      alert("Please select both course and year");
      return;
    }

    navigate("/select-student", {
      state: { course, year }
    });
  };

  return (
    
    <div className="vs-wrapper">

      <button className="ss-back-btn" onClick={() => navigate("/teacher-dashboard")}>
        ⬅ Back
      </button>

      <h1 className="vs-title"> View Student Attendance</h1>

      <div className="vs-box">
        
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">Select Course...</option>
          <option value="Computer Science Engineering (AIML)">CSE (AIML)</option>
          <option value="Computer Science Engineering (Core)">CSE (Core)</option>
          <option value="Electronics & Communication Engineering">ECE</option>
          <option value="Electrical Engineering">EE</option>
          <option value="Mechanical Engineering">ME</option>
          <option value="Civil Engineering">CE</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year...</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <button className="vs-btn" onClick={goNext}>
          Next ➜
        </button>

      </div>

    </div>
  );
}
