const express = require("express");
const app = express();
const PORT = 3002;

// In-memory sample course data
const courses = [
  { id: 1, code: "CS301", name: "Cloud Computing", credits: 4 },
  { id: 2, code: "CS302", name: "DevOps Practices", credits: 3 },
  { id: 3, code: "CS303", name: "Microservices Architecture", credits: 3 },
  { id: 4, code: "IT201", name: "Database Management Systems", credits: 4 },
  { id: 5, code: "CS401", name: "Machine Learning", credits: 4 },
];

// GET /courses — returns the list of sample courses
app.get("/courses", (req, res) => {
  res.json({ success: true, data: courses });
});

// GET /health — returns the health status of this service
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "course-service" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Course Service is running on port ${PORT}`);
});
