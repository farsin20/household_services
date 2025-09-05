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
  console.log('Role request received:', req.query);
  const email = req.query.email;

  if (!email) {
    console.log('No email provided in query');
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    console.log('Searching for user with email:', email);
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log('User not found, creating new user with customer role');
      // Create a new user with default role if not found
      const newUser = {
        email,
        role: 'customer',
        userType: 'customer'
      };
      await usersCollection.insertOne(newUser);
      return res.json({ success: true, role: 'customer' });
    }

    console.log('User found:', user);
    // Return the role (check both role and userType fields)
    const userRole = user.role || user.userType || 'customer';
    console.log('Returning role:', userRole);
    res.json({ success: true, role: userRole });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ success: false, error: "Failed to fetch role" });
  }
});

module.exports = router;
