
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewStudents.css";

export default function ViewStudents() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { course, year } = state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course || !year) {
      navigate("/student-data");
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          "http://localhost:5000/api/students/filter",
          { params: { course, year } }
        );

        setStudents(res.data);
      } catch (err) {
        console.error(
          "Fetch students error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.error ||
          err.message ||
          "Unable to fetch students."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [course, year, navigate]);

  return (
    <div className="vs-wrapper">
      <button
        className="vs-back-btn"
        onClick={() => navigate("/student-data")}
      >
        ⬅ Back
      </button>

      
      <div className="vs-card">
        <div className="vs-header">
          <h1 className="vs-title">{course}</h1>
          <h3 className="vs-subtitle">{year}</h3>
        </div>

        <div className="vs-student-box">
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p className="vs-no-data">
              Error loading students: {error}
            </p>
          ) : students.length === 0 ? (
            <p className="vs-no-data">
              No students found for this course and year.
            </p>
          ) : (
            students.map((student) => (
              <div className="vs-student-card" key={student.id}>
                <strong className="vs-name">
                  {student.student_name}
                </strong>
                <span className="vs-roll">
                  Roll No: {student.roll_no}
                </span>
              </div>
            ))
          )}
        </div>

        {!loading && !error && (
          <p className="vs-total">
            Total students: {students.length}
          </p>
        )}
      </div>
    </div>
  )
}