import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./AttendanceForm.css";

export default function AttendanceForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { course, year } = location.state || {};

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students/filter", {
          params: { course, year }
        });
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [course, year]);


  const handleSelect = (roll_no, status) => {
    setAttendance(prev => ({
      ...prev,
      [roll_no]: status
    }));
  };


  // Submit attendance
  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const payload = {
      session_code: date,
      attendance: students.map(s => ({
        roll_no: s.roll_no,
        status: attendance[s.roll_no] || "A" // default Absent
      }))
    };

    try {
      await axios.post("http://localhost:5000/api/attendance/submit", payload);
      alert("Attendance Saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };


  return (
    <div className="att-container">

 <button className="vs-back-btn" onClick={() => navigate("/select-course")}>
        ⬅ Back
      </button>




      <div className="att-box">

        <h2 className="att-title">{course} – {year}</h2>

        <div className="date-box">
          <label>Select Date: </label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <table className="att-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Attendance</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.roll_no}>
                <td>{s.roll_no}</td>
                <td>{s.student_name}</td>

                <td>
                  <div className="radio-group">

                   

                    <label>
                      <input
                        type="radio"
                        name={`att-${s.roll_no}`}
                        onChange={() => handleSelect(s.roll_no, "A")}
                      />
                      A
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`att-${s.roll_no}`}
                        onChange={() => handleSelect(s.roll_no, "P")}
                      />
                      P
                    </label>

                    <label>
                      <input
                        type="radio"
                        name={`att-${s.roll_no}`}
                        onChange={() => handleSelect(s.roll_no, "H")}
                      />
                      H
                    </label>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Attendance
        </button>

      </div>
    </div>
  );
}

