import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SelectStudent.css";

export default function SelectStudent() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const course = state?.course;
  const year = state?.year;

  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!course || !year) {
      navigate("/view-reports");
      return;
    }

    const loadStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students/filter", {
          params: { course, year }
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    loadStudents();
  }, [course, year, navigate]);

  const goNext = (s) => {
    navigate("/attendance-history", {
      state: {
        student_id: s.id,
        student_name: s.student_name,
        roll_no: s.roll_no,
        course,
        year
      }
    });
  };

  return (
    <div className="ss-wrapper">

      
      <button className="ss-back-btn" onClick={() => navigate("/view-reports")}>
        ← Back
      </button>

      <h1 className="ss-title">📘 Select Student</h1>
      <p className="ss-subtitle">{course} — {year}</p>

      <div className="ss-list">
        {students.length === 0 ? (
          <p className="ss-no-data">No students found.</p>
        ) : (
          students.map((s) => (
            <div
              key={s.id}
              className="ss-card"
              onClick={() => goNext(s)}
            >
              <strong>{s.student_name}</strong>
              <span className="roll-no">({s.roll_no})</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
