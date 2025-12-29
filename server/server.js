const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const measurementRoutes = require("./routes/measurements");
const diaryRoutes = require("./routes/diary");
const labReportRoutes = require("./routes/labReports");
const doctorReportRoutes = require("./routes/doctorReports");
const aiRoutes = require("./routes/ai");

const app = express();
dotenv.config();

// Increase payload limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Connect to MongoDB
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lifedoc")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/api/doctor-reports", doctorReportRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.SERVER_PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;