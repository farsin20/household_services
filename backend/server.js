// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./db");
const userRoutes = require("./Routes/users.js"); 
const requestRoutes = require("./Routes/request.js");
const reviewRoutes = require("./Routes/reviews.js");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/reviews", reviewRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Start server only after DB is connected
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Could not start server:", err.message);
});
