// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db");
const userRoutes = require("./Routes/users.js"); 
const requestRoutes = require("./Routes/request.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

// Start server only after DB is connected
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("❌ Could not start server:", err.message);
});
