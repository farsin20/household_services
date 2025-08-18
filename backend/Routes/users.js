const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

// POST /api/users — save new user
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const newUser = req.body;

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, error: "Failed to save user" });
  }
});

// ✅ GET /api/users/role?email=user@example.com — get user role
router.get("/role", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, role: user.userType || "customer" }); // default to 'customer'
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ success: false, error: "Failed to fetch role" });
  }
});

module.exports = router;
