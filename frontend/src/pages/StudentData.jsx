import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentData.css";

const branches = [
  "Computer Science Engineering (AIML)",
  "Computer Science Engineering (Core)",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics & Communication Engineering",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function StudentData() {
  const [openBranch, setOpenBranch] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="sd-wrapper">
      {/* HOME BUTTON */}
      <button
        className="sd-home-btn"
        onClick={() => navigate("/teacher-dashboard")}
      >
        ⬅ Home
      </button>

      <h1 className="sd-title">📊 Student Directory</h1>

      <div className="sd-branch-container">
        {branches.map((branch, index) => (
          <div key={index} className="sd-branch-card">
            <button
              className="sd-branch-btn"
              onClick={() => setOpenBranch(openBranch === index ? null : index)}
            >
              {branch}
            </button>

            {openBranch === index && (
              <div className="sd-year-dropdown">
                {years.map((year, i) => (
                  <button
                    key={i}
                    className="sd-year-btn"
                    onClick={() =>
                      navigate("/view-students", {
                        state: { course: branch, year },
                      })
                    }
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
