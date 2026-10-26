import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddStudent.css";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await axios.post("http://localhost:5000/api/students", {
  student_name: name,
  course: course,
  roll_no: rollNo,
  year: year,
});


      alert("Student Added Successfully!");
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error("Add Student Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.details ||
        error.response?.data?.error ||
        error.message ||
        "Error adding student!"
      );
    }
  };

  return (
    <div className="add-student-wrapper">
      <form className="add-student-box" onSubmit={handleSubmit}>
        
        <h2 className="add-student-title">Add New Student</h2>

        <label className="add-student-label">Student Name</label>
        <input
          type="text"
          className="add-student-input"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label className="add-student-label">Course</label>

        <select
          className="add-student-input"
          required
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
  <option value="Computer Science Engineering (AIML)">Computer Science Engineering (AIML)</option>
  <option value="Computer Science Engineering (Core)">Computer Science Engineering (Core)</option>
  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
  <option value="Electrical Engineering">Electrical Engineering</option>
  <option value="Mechanical Engineering">Mechanical Engineering</option>
  <option value="Civil Engineering">Civil Engineering</option>
        </select>

        <label className="add-student-label">Roll No</label>
        <input
          type="text"
          className="add-student-input"
          required
          onChange={(e) => setRollNo(e.target.value)}
        />

        <label className="add-student-label">Year</label>
        <select
          className="add-student-input"
          required
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <button type="submit" className="add-student-btn">
          Add Student
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/teacher-dashboard")}
          
          type="button"
        >
           ⬅ Home
        </button>

      </form>
    </div>
  );
}
