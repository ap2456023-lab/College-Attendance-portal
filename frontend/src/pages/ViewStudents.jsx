import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewStudents.css";

export default function ViewStudents() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { course, year } = state || {};
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!course || !year) {
      navigate("/student-data");
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students/filter", {
          params: { course, year },
        });
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [course, year]);

  return (
    <div className="vs-wrapper">

      <button className="vs-back-btn" onClick={() => navigate("/student-data")}>
        ⬅ Back
      </button>

      <div className="vs-card">

        <h1 className="vs-title"> {course}</h1>
        <h3 className="vs-subtitle">{year}</h3>

        <div className="vs-student-box">
          {students.length === 0 ? (
            <p className="vs-no-data">No students found.</p>
          ) : (
            students.map((s) => (
              <div className="vs-student-card" key={s.id}>
                <strong className="vs-name">{s.student_name}</strong>
                <span className="vs-roll">{s.roll_no}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
