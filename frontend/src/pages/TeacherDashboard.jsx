
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherDashboard.css";

const MENU_ITEMS = [
  { label: "Dashboard", icon: "▦", path: "/teacher-dashboard" },
  { label: "Mark Attendance", icon: "✓", path: "/select-course" },
  { label: "Student Directory", icon: "♙", path: "/student-data" },
  { label: "Add Student", icon: "+", path: "/add-student" },
  { label: "Attendance Reports", icon: "▤", path: "/view-reports" },
];

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString, options = {}) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    "en-IN",
    options
  );
}

function RadialChart({ present, absent, total }) {
  const percentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  const presentAngle = total > 0 ? (present / total) * 360 : 0;

  return (
    <div className="attendance-ring-wrap">
      <div
        className="attendance-ring"
        style={{
          background:
            `conic-gradient(#16a34a 0deg ${presentAngle}deg, ` +
            `#f87171 ${presentAngle}deg 360deg)`,
        }}
        role="img"
        aria-label={`${present} present, ${absent} absent, ${percentage}% attendance`}
      >
        <div className="attendance-ring-inner">
          <strong>{percentage}%</strong>
          <span>Attendance</span>
        </div>
      </div>

      <div className="ring-legend">
        <div className="legend-item">
          <span className="legend-dot dot-present" />
          <span>Present</span>
          <strong>{present}</strong>
        </div>

        <div className="legend-item">
          <span className="legend-dot dot-absent" />
          <span>Absent</span>
          <strong>{absent}</strong>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  
const [totalStudents, setTotalStudents] = useState(0);
const [dailyData, setDailyData] = useState([]);
const [branchData, setBranchData] = useState([]);
const [current, setCurrent] = useState({
  total: 0,
  present: 0,
  absent: 0
});
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/dashboard",
        { params: { date: selectedDate } }
      );

      const total = res.data.totalStudents;
      const records = res.data.dailyData;
      setBranchData(res.data.branchData || []);

      // Show all seven dates, including dates with no records.
      const days = [];

      for (let offset = 6; offset >= 0; offset--) {
        const date = new Date(`${selectedDate}T12:00:00`);
        date.setDate(date.getDate() - offset);

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const iso = `${y}-${m}-${d}`;

        const record = records.find(
          (item) => item.date === iso
        );

        days.push({
          date: iso,
          total,
          present: record?.present ?? 0,
          absent: record?.absent ?? 0
        });
      }

      const selected = days.find(
        (day) => day.date === selectedDate
      );

      setTotalStudents(total);
      setDailyData(days);
      setCurrent({
        total,
        present: selected?.present ?? 0,
        absent: selected?.absent ?? 0
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [selectedDate]);

const attendancePercentage =
  current.total > 0
    ? Math.round((current.present / current.total) * 100)
    : 0;

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="attendance-dashboard">
      {menuOpen && (
        <button
          className="drawer-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        id="dashboard-drawer"
        className={`dashboard-drawer ${menuOpen ? "drawer-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-mark">A</div>
            <div>
              <strong>Attendance</strong>
              <span>Management System</span>
            </div>
          </div>

          <button
            className="drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
          >
            ×
          </button>
        </div>

        <p className="drawer-section-label">MAIN MENU</p>

        <nav className="drawer-nav" aria-label="Main navigation">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`drawer-link ${
                item.path === "/teacher-dashboard" ? "active" : ""
              }`}
              onClick={() => goTo(item.path)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="drawer-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.path === "/teacher-dashboard" && (
                <span className="active-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="teacher-profile">
            <div className="teacher-avatar">T</div>
            <div className="teacher-details">
              <strong>Teacher</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            className="drawer-link logout-link"
            onClick={handleLogout}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span className="drawer-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="dashboard-topbar">
        <div className="topbar-left">
          <button
            className="hamburger-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="dashboard-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your attendance overview.</p>
          </div>
        </div>

        <div className="topbar-date">
          <span className="calendar-icon">▦</span>
          <div>
            <span className="date-caption">TODAY</span>
            <strong>
              {formatDate(toISODate(new Date()), {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="summary-grid" aria-label="Attendance summary">
          <article className="summary-card">
            <div className="summary-card-top">
              <span className="summary-icon total-icon">♙</span>
              <span className="summary-label">ALL STUDENTS</span>
            </div>
            <strong className="summary-number">{current.total}</strong>
            <p className="summary-para">Registered students</p>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <span className="summary-icon present-icon">✓</span>
              <span className="summary-label">PRESENT</span>
            </div>
            <strong className="summary-number">{current.present}</strong>
            <p className="summary-para">{attendancePercentage}% of total students</p>
          </article>

          <article className="summary-card">
            <div className="summary-card-top">
              <span className="summary-icon absent-icon">×</span>
              <span className="summary-label">ABSENT</span>
            </div>
            <strong className="summary-number">{current.absent}</strong>
            <p className="summary-para">{100 - attendancePercentage}% of total students</p>
          </article>
        </section>

        <section className="analytics-grid">
          <article className="dashboard-panel radial-panel">
            <div className="panel-heading">
              <div>
                <h2>Attendance Overview</h2>
                <p>Present vs absent students</p>
              </div>
              <span className="panel-chip">Selected date</span>
            </div>

            <div className="selected-date-label">
              {formatDate(selectedDate, {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            <RadialChart
              present={current.present}
              absent={current.absent}
              total={current.total}
            />
          </article>

          <article className="dashboard-panel trend-panel">
            <div className="panel-heading">
              <div>
                <h2>Daily Attendance</h2>
                <p>Select a date to see its attendance details</p>
              </div>
              <span className="trend-indicator">
                <span className="legend-dot dot-present" />
                Last 7 days
              </span>
            </div>

            <div className="daily-chart">
              {dailyData.map((day) => {
                const isSelected = day.date === selectedDate;

                const dateObj = new Date(day.date + "T00:00:00");

                const dayName = dateObj.toLocaleDateString("en-IN", {
                  weekday: "short",
                });

                const formattedDate = dateObj.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                });

                
                return (
                  <button
                    key={day.date}
                    className={`daily-column ${
                      isSelected ? "selected-column" : ""
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                    aria-pressed={isSelected}
                    title={`${formatDate(day.date)}: ${day.present} present`}
                  >
                    {/* Present strength - above bar */}
                    <span className="bar-value">{day.present}</span>

                    {/* Bar */}
                    <div className="daily-bar-area">
                      <div
                        className="daily-bar"
                        style={{
                          height: `${day.total > 0 ? (day.present / day.total) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    {/* Date and day - below bar */}
                    <span className="daily-date">{formattedDate}</span>
                    <span className="daily-day">{dayName}</span>
                  </button>
                );
              })}
            </div>

            <div className="chart-footnote">
              <span className="legend-dot dot-present" />
              <span>Present students</span>
              <span className="chart-footnote-note">
                Click any bar to select a date
              </span>
            </div>
          </article>
        </section>

        <section className="dashboard-panel history-panel">
          <div className="panel-heading history-heading">
            <div>
              <h2>Attendance History</h2>
              <p>Branch Wise Attendance Records</p>
            </div>

            <label className="date-picker-label">
              <span style={{color:"black", fontSize:"1.02rem"}}>View date</span>
              <input
                type="date"
                value={selectedDate}
                max={toISODate(new Date())}
                min={dailyData[0]?.date}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>
          </div>

          <div className="table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Total students</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance rate</th>
                </tr>
              </thead>
              <tbody>
                  {branchData.map((branch) => {
                    const rate =
                      branch.total > 0
                        ? Math.round((branch.present / branch.total) * 100)
                        : 0;

                    return (
                      <tr key={branch.branch}>
                        <td>{branch.branch}</td>
                        <td>{branch.total}</td>
                        <td className="present-text">{branch.present}</td>
                        <td className="absent-text">{branch.absent}</td>
                        <td>
                          <div className="rate-cell">
                            <div className="rate-track">
                              <div
                                className="rate-fill"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span>{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {branchData.length === 0 && (
                    <tr>
                      <td colSpan={5}>No branch data available.</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </section>

        
<footer className="dashboard-footer">
  <div className="footer-brand">
    <div className="footer-logo">A</div>

    <div className="footer-brand-text">
      <strong>Digital Attendance System</strong>
      <span>Smart attendance. Better insights.</span>
    </div>
  </div>

  <div className="footer-bottom">
    <p style={{fontSize:'15px',fontWeight:'5px'}}>
      © {new Date().getFullYear()} Digital Attendance System.
      <span className="rights-text"> All rights reserved.</span>
    </p>

    <div className="footer-social">
      <span className="social-heading">We're on social</span>

      <div className="social-links">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
        >
          <i className="fa-brands fa-facebook-f" />
        </a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <i className="fa-brands fa-instagram" />
        </a>

        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          title="X"
        >
          <i className="fa-brands fa-x-twitter" />
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <i className="fa-brands fa-linkedin-in" />
        </a>
      </div>
    </div>
  </div>
</footer>

      </main>
    </div>
  );
}
