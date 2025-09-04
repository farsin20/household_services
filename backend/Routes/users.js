const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

// POST /api/users — save new user
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const userRole = (req.body.role || req.body.userType || "customer").toLowerCase();
    const newUser = {
      ...req.body,
      role: userRole,
      userType: userRole // Set both fields to be consistent
    };
    console.log("Creating new user with data:", newUser);
    console.log("Received new user data:", newUser);
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

// Get all workers
router.get("/workers", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    
    console.log("Fetching workers from database...");
    // First, let's see what roles exist in the database
    const allUsers = await usersCollection.find({}).toArray();
    console.log("All users in database:", allUsers.map(user => ({
      email: user.email,
      role: user.role,
      userType: user.userType
    })));
    
    // Now try to find workers with either role or userType
    const workers = await usersCollection.find({
      $or: [
        { role: { $regex: new RegExp("^worker$", "i") } },
        { userType: { $regex: new RegExp("^worker$", "i") } }
      ]
    }).toArray();
    console.log("Found workers:", workers.length, workers);
    res.json({ success: true, workers });
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ success: false, error: "Failed to fetch workers" });
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
