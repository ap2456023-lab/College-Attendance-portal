const express = require("express");
const router = express.Router();
const pool = require("../db");

// Add a new student
router.post("/", async (req, res) => {
  try {
    const { student_name, course, roll_no, year } = req.body;

    const query = `
      INSERT INTO student_data (student_name, course, roll_no, year)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      student_name,
      course,
      roll_no,
      year,
    ]);

    res.json({
      success: true,
      message: "Student added successfully!",
      student: result.rows[0],
    });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: err.message,
    });
  }
});

module.exports = router;
