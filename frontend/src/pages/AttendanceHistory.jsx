import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AttendanceHistory.css";

export default function AttendanceHistory() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { student_id, student_name, roll_no, course, year } = state || {};

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [yearNow, setYearNow] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({}); // Map: { day: "P" }

  useEffect(() => {
    if (!student_id) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/attendance/history", {
          params: {
            student_id,
            month: Number(month),
            year: Number(yearNow),
          },
        });

        let formatted = {};
        res.data.forEach((row) => {
          const day = new Date(row.session_code).getDate();
          formatted[day] = row.status;
        });

        setAttendance(formatted);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchHistory();
  }, [student_id, month, yearNow]);

  const daysInMonth = new Date(yearNow, month, 0).getDate();

  return (
    <div className="ah-wrapper">
      {/* Back Button */}
      <button
  className="ah-back-btn"
  onClick={() =>
    navigate("/select-student", {
      state: { course, year }    
    })
  }
>
  ⬅ Back
</button>


      <h1 className="ah-title">Attendance History 📅</h1>

      {/* Student Info */}
      <div className="ah-info">
        <p>
          <strong>Name:</strong> {student_name}
        </p>
        <p>
          <strong>Roll No:</strong> {roll_no}
        </p>
        <p>
          <strong>Course:</strong> {course}
        </p>
        <p>
          <strong>Year:</strong> {year}
        </p>
      </div>

      <div className="ah-month-box">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(2025, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={yearNow} onChange={(e) => setYearNow(Number(e.target.value))}>
  <option value={yearNow - 1}>{yearNow - 1}</option>
  <option value={yearNow}>{yearNow}</option>
  <option value={yearNow + 1}>{yearNow + 1}</option>
</select>

      </div>

      <div className="ah-table">
        <table>
          <thead>
            <tr>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const status = attendance[day] || null;

                return (
                  <td
                    key={i}
                    className={
                      status === "P"
                        ? "present"
                        : status === "A"
                        ? "absent"
                        : status === "H"
                        ? "holiday"
                        : "empty"
                    }
                  >
                    {status || "—"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
