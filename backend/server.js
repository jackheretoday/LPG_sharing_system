const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ override: true });

const systemRoutes = require("./routes/systemRoutes");
const authRoutes = require("./routes/authRoutes");
const dbRoutes = require("./routes/dbRoutes");
const trustRoutes = require("./routes/trustRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const disputeRoutes = require("./routes/disputeRoutes");
const internalRoutes = require("./routes/internalRoutes");
const lpgRoutes = require("./routes/lpgRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { seedTestUsers } = require("./models/tempUserStore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "LPG backend server is running",
    routes: [
      "/api",
      "/api/health",
      "/api/auth/signup",
      "/api/auth/login",
      "/api/auth/request-otp",
      "/api/auth/verify-otp",
      "/api/auth/me",
      "/api/db/status",
      "/api/trust/me",
      "/api/trust/user/:id",
      "/api/verification/pin-verify",
      "/api/verification/id-upload",
      "/api/verification/id-review",
      "/api/disputes",
      "/api/internal/exchange-completed",
      "/api/internal/emergency-response-logged",
      "/api/lpg/cylinders",
      "/api/lpg/usage",
      "/api/lpg/predict",
      "/api/lpg/alerts",
      "/api/lpg/alert-config",
    ],
  });
});

app.use("/api", systemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/db", dbRoutes);
app.use("/api/trust", trustRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/lpg", lpgRoutes);

app.use(notFound);
app.use(errorHandler);

// Seed test users on startup
seedTestUsers().catch(err => console.error("❌ Failed to seed test users:", err));

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
