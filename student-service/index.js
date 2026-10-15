const express = require("express");
const app = express();
const PORT = 3001;

// In-memory sample student data
const students = [
  { id: 1, name: "Aarav Sharma", rollNo: "CS2024001", branch: "Computer Science" },
  { id: 2, name: "Priya Patel", rollNo: "CS2024002", branch: "Computer Science" },
  { id: 3, name: "Rahul Verma", rollNo: "IT2024001", branch: "Information Technology" },
  { id: 4, name: "Sneha Reddy", rollNo: "EC2024001", branch: "Electronics" },
  { id: 5, name: "Vikram Singh", rollNo: "ME2024001", branch: "Mechanical" },
];

// GET /students — returns the list of sample students
app.get("/students", (req, res) => {
  res.json({ success: true, data: students });
});

// GET /health — returns the health status of this service
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "student-service" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Student Service is running on port ${PORT}`);
});
