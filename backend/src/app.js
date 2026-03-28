import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "https://golf-charity-subscription-platform-nu.vercel.app"
];
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Golf Charity Platform API is running",
    docs: "/api"
  });
});

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Available API groups",
    routes: ["/api/health", "/api/auth", "/api/users", "/api/charities", "/api/draws", "/api/admin"]
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
