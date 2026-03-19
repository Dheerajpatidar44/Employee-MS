import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./db/db.js";

import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leave.js";
import attendanceRouter from "./routes/attendance.js";

import path from "path";
import { fileURLToPath } from "url";

// ✅ Import models (register schemas)
import "./models/User.js";
import "./models/Department.js";
import "./models/Employee.js";
import "./models/Salary.js";
import "./models/Leave.js";
import "./models/Attendance.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(
	cors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://employeefrontend-mu.vercel.app"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json());

// ✅ Static files
app.use(
	"/public/uploads",
	express.static(path.join(__dirname, "public/uploads"))
);

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/attendance", attendanceRouter);

// ✅ Health check
app.get("/", (req, res) => {
	res.json({
		status: "ok",
		message: "✅ Employee API backend running successfully",
		env: process.env.NODE_ENV || "not set",
		timestamp: new Date().toISOString(),
	});
});

// ✅ Global error handler (LAST middleware)
app.use((err, req, res, next) => {
	console.error("Error:", err);
	res.status(500).json({
		error: "Internal Server Error",
		message: err.message,
	});
});

// ✅ START SERVER (IMPORTANT)
const PORT = process.env.PORT || 5000;

connectToDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`✅ Server running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ Database connection failed:", err);
	});
