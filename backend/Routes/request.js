// routes/requests.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

// POST /api/requests - Save a new service request
router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming POST /api/requests");
    console.log("Request body:", req.body);

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");

    // Add default status = "pending"
    const newRequest = {
      ...req.body,
      status: "pending", // default status
      createdAt: new Date(), // optional timestamp
    };

    console.log("📝 Inserting new request:", newRequest);

    const result = await requestsCollection.insertOne(newRequest);

    console.log("✅ Insert successful, ID:", result.insertedId);

    res.status(201).json({
      success: true,
      message: "Service request submitted successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Error saving service request:", error);
    res.status(500).json({ success: false, error: "Failed to submit service request" });
  }
});

// GET /api/requests - Fetch all service requests
router.get("/", async (req, res) => {
  try {
    console.log("📩 Incoming GET /api/requests");

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");

    console.log("🔍 Fetching all requests...");
    const requests = await requestsCollection.find({}).toArray();

    console.log(`✅ Found ${requests.length} requests`);
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("❌ Error fetching service requests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch service requests",
    });
  }
});

// GET /api/requests/:email - Fetch requests by email
router.get("/:email", async (req, res) => {
  try {
    console.log("📩 Incoming GET /api/requests/:email");
    const userEmail = req.params.email;
    console.log("🔍 Fetching requests for email:", userEmail);

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");

    const requests = await requestsCollection.find({ email: userEmail }).toArray();

    console.log(`✅ Found ${requests.length} requests for ${userEmail}`);
    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("❌ Error fetching customer requests:", error);
    res.status(500).json({ success: false, error: "Failed to fetch requests" });
  }
});

module.exports = router;
