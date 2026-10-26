require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Attendance Backend Running ✔️');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/students', async (req, res) => {
  const { student_name, course, roll_no, year } = req.body;

  try {
    await db.query(
      `INSERT INTO student_data (student_name, course, roll_no, year)
       VALUES (?, ?, ?, ?)`,
      [student_name, course, roll_no, year]
    );

    res.json({ message: 'Student added successfully' });
  } catch (error) {
  console.error("DB Error code:", error.code);
  console.error("DB Error message:", error.message);

  res.status(500).json({
    error: "Database error",
    details: error.message
  });
}
});

app.get('/api/students/filter', async (req, res) => {
  const { course, year } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT * FROM student_data
       WHERE course = ? AND year = ?
       ORDER BY roll_no ASC`,
      [course, year]
    );

    res.json(rows);
  } catch (err) {
    console.error('Filter Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Submit attendance
app.post('/api/attendance/submit', async (req, res) => {
  console.log('🔥 Attendance Submit API Hit');
  console.log('Payload:', req.body);

  try {
    const { session_code, attendance } = req.body;

    if (!session_code || !Array.isArray(attendance)) {
      return res.status(400).json({
        error: 'session_code and attendance array are required'
      });
    }

    for (const row of attendance) {
      const [students] = await db.query(
        'SELECT id FROM student_data WHERE roll_no = ?',
        [row.roll_no]
      );

      if (students.length === 0) continue;

      const student_id = students[0].id;

      await db.query(
        `INSERT INTO attendance
          (session_code, student_id, roll_no, status, marked_at)
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          marked_at = NOW()`,
        [session_code, student_id, row.roll_no, row.status]
      );
    }

    res.json({ message: 'Attendance saved!' });
  } catch (err) {
    console.error('Attendance Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Monthly attendance report
app.get('/api/attendance/monthly-report', async (req, res) => {
  const { course, year, month } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT
          s.id,
          s.student_name,
          s.roll_no,
          a.session_code,
          a.status
       FROM student_data s
       LEFT JOIN attendance a
          ON s.id = a.student_id
          AND DATE_FORMAT(a.session_code, '%Y-%m') = ?
       WHERE s.course = ? AND s.year = ?
       ORDER BY s.roll_no ASC`,
      [month, course, year]
    );

    res.json(rows);
  } catch (err) {
    console.error('Monthly Report Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// student attendance history
app.get('/api/attendance/history', async (req, res) => {
  try {
    const { student_id, month, year } = req.query;

    if (!student_id || !month || !year) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const [rows] = await db.query(
      `SELECT session_code, status
       FROM attendance
       WHERE student_id = ?
         AND session_code BETWEEN ? AND ?
       ORDER BY session_code ASC`,
      [student_id, startDate, endDate]
    );

    res.json(rows);
  } catch (err) {
    console.error('History Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get("/api/dashboard", async (req, res) => {
  try {
    const selectedDate = req.query.date;

    if (!selectedDate) {
      return res.status(400).json({
        error: "Date is required"
      });
    }

    // Total students registered in the database
    const [studentRows] = await db.query(
      "SELECT COUNT(*) AS total FROM student_data"
    );

    const [summaryRows] = await db.query(
      `SELECT
         COALESCE(SUM(status = 'Present'), 0) AS present,
         COALESCE(SUM(status = 'Absent'), 0) AS absent
       FROM attendance
       WHERE session_code = ?`,
      [selectedDate]
    );

// Branch-wise attendance for the selected date
    const [branchRows] = await db.query(
      `SELECT
        s.course AS branch,
        COUNT(DISTINCT s.id) AS total,
        COUNT(DISTINCT CASE
          WHEN a.status = 'Present' THEN s.id
        END) AS present,
        COUNT(DISTINCT CASE
          WHEN a.status = 'Absent' THEN s.id
        END) AS absent
      FROM student_data s
      LEFT JOIN attendance a
        ON a.student_id = s.id
        AND a.session_code = ?
      GROUP BY s.course
      ORDER BY s.course ASC`,
      [selectedDate]
    );

 // Attendance records for the last seven days
    const endDate = new Date(`${selectedDate}T12:00:00`);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const toISO = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const [dailyRows] = await db.query(
      `SELECT
         session_code AS date,
         SUM(status = 'Present') AS present,
         SUM(status = 'Absent') AS absent
       FROM attendance
       WHERE session_code BETWEEN ? AND ?
       GROUP BY session_code
       ORDER BY session_code ASC`,
      [toISO(startDate), selectedDate]
    );

    res.json({
      totalStudents: Number(studentRows[0].total),
      selected: {
        present: Number(summaryRows[0].present),
        absent: Number(summaryRows[0].absent)
      },
      dailyData: dailyRows.map((row) => ({
        date: String(row.date).slice(0, 10),
        present: Number(row.present),
        absent: Number(row.absent)
      })),
      branchData: branchRows.map((row) => ({
        branch: row.branch,
        total: Number(row.total),
        present: Number(row.present),
        absent: Number(row.absent)
      }))
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({
      error: "Failed to load dashboard data"
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Fetch students from MySQL
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, student_name, course, roll_no, year
       FROM student_data
       ORDER BY roll_no ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Fetch Students Error:", error.message);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});