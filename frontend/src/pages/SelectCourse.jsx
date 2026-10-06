import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectCourse.css";

export default function SelectCourse() {
  const [openCourse, setOpenCourse] = useState(null);
  const navigate = useNavigate();

  // 🔥 Full Course Mapping (Short → Full ENUM value)
  const courseMap = {
    AIML: "Computer Science Engineering (AIML)",
    CSECore: "Computer Science Engineering (Core)",
    ECE: "Electronics & Communication Engineering",
    EE: "Electrical Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering"
  };

  const toggleCourse = (course) => {
    setOpenCourse(openCourse === course ? null : course);
  };

  const goToAttendance = (shortCourse, year) => {
    navigate("/attendance-form", {
      state: { 
        course: courseMap[shortCourse], 
        year: year,
        header: `${shortCourse} – ${year}` 
      }
    });
  };

  return (
    <div className="course-wrapper">

      <button className="vs-back-btn" onClick={() => navigate("/teacher-dashboard")}>
        ⬅ Back
      </button>

      <h1 className="title">Select Course</h1>

      {/* CSE AIML */}
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("AIML")}>
          Computer Science Engineering (AIML)
        </button>

        <div className={`year-box ${openCourse === "AIML" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("AIML", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("AIML", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("AIML", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("AIML", "4th Year")}>4th Year</button>
        </div>
      </div>

      
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("CSECore")}>
          Computer Science Engineering (Core)
        </button>

        <div className={`year-box ${openCourse === "CSECore" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("CSECore", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CSECore", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CSECore", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CSECore", "4th Year")}>4th Year</button>
        </div>
      </div>

      
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("ECE")}>
          Electronics & Communication Engineering
        </button>

        <div className={`year-box ${openCourse === "ECE" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("ECE", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ECE", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ECE", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ECE", "4th Year")}>4th Year</button>
        </div>
      </div>

      
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("EE")}>
          Electrical Engineering
        </button>

        <div className={`year-box ${openCourse === "EE" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("EE", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("EE", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("EE", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("EE", "4th Year")}>4th Year</button>
        </div>
      </div>

      
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("ME")}>
          Mechanical Engineering
        </button>

        <div className={`year-box ${openCourse === "ME" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("ME", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ME", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ME", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("ME", "4th Year")}>4th Year</button>
        </div>
      </div>

      
      <div className="course-box">
        <button className="course-btn" onClick={() => toggleCourse("CE")}>
          Civil Engineering
        </button>

        <div className={`year-box ${openCourse === "CE" ? "open" : ""}`}>
          <button className="year-btn" onClick={() => goToAttendance("CE", "1st Year")}>1st Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CE", "2nd Year")}>2nd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CE", "3rd Year")}>3rd Year</button>
          <button className="year-btn" onClick={() => goToAttendance("CE", "4th Year")}>4th Year</button>
        </div>
      </div>
    </div>
  );
}
