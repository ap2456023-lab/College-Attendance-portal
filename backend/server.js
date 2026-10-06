require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Attendance Backend Running ✔️'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

//add students
app.post("/api/students", async (req, res) => {
  const { student_name, course, roll_no, year } = req.body;
  try {
    await db.query(
      "INSERT INTO student_data (student_name, course, roll_no, year) VALUES ($1, $2, $3, $4)",
      [student_name, course, roll_no, year]
    );
    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

//fetch students
app.get("/api/students/filter", async (req, res) => {
  const { course, year } = req.query;

  try {
    const result = await db.query(
      "SELECT * FROM student_data WHERE course = $1 AND year = $2 ORDER BY roll_no ASC",
      [course, year]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//submit atendance
app.post("/api/attendance/submit", async (req, res) => {
  console.log("🔥 Attendance Submit API Hit");
  console.log("Payload:", req.body);

  try {
    const { session_code, attendance } = req.body;

    for (let row of attendance) {
      const student = await db.query(
        "SELECT id FROM student_data WHERE roll_no=$1",
        [row.roll_no]
      );

      if (student.rows.length === 0) continue;

      const student_id = student.rows[0].id;

      await db.query(
        `INSERT INTO attendance (session_code, student_id, roll_no, status, marked_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (student_id, session_code)
         DO UPDATE SET status = EXCLUDED.status`,
        [session_code, student_id, row.roll_no, row.status]
      );
    }

    res.json({ message: "Attendance saved!" });

  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//monthly report
app.get("/api/attendance/monthly-report", async (req, res) => {
  const { course, year, month } = req.query;

  try {
    const result = await db.query(
      `SELECT s.id, s.student_name, s.roll_no,
              a.session_code, a.status
       FROM student_data s
       LEFT JOIN attendance a
       ON s.id = a.student_id 
       AND TO_CHAR(a.session_code, 'YYYY-MM') = $3
       WHERE s.course = $1 AND s.year = $2
       ORDER BY s.roll_no ASC`,
      [course, year, month]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Monthly Report Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});


app.get("/api/attendance/history", async (req, res) => {
  try {
    const { student_id, month, year } = req.query;

    if (!student_id || !month || !year) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const result = await db.query(
      `SELECT session_code, status 
       FROM attendance 
       WHERE student_id = $1 
       AND session_code BETWEEN $2 AND $3
       ORDER BY session_code ASC`,
      [student_id, startDate, endDate]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server listening on port ${PORT}`));
