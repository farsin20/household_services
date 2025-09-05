// routes/requests.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require('mongodb');

// GET /api/requests/:email - Get customer's requests
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching requests for customer: ${email}`);
    
    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");
    
    const requests = await requestsCollection.find({
      customerEmail: email
    }).sort({ createdAt: -1 }).toArray();
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching customer requests:", error);
    res.status(500).json({ success: false, error: "Failed to fetch requests" });
  }
});

// GET /api/requests/completed/:email - Get customer's completed requests
router.get("/completed/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");
    
    const requests = await requestsCollection.find({
      customerEmail: email,
      status: "completed"
    }).sort({ completedAt: -1 }).toArray();
    
    res.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching completed requests:", error);
    res.status(500).json({ success: false, error: "Failed to fetch completed requests" });
  }
});

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

    res.json({ success: true, requests });
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ success: false, error: "Failed to fetch requests" });
  }
});

// GET /api/requests/worker/:email - Fetch jobs for a specific worker
// Get worker's jobs
router.get("/worker/:email", async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`📩 Incoming GET /api/requests/worker/${email}`);

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");

    console.log("🔍 Fetching worker's jobs...");
    const jobs = await requestsCollection.find({ 
      assignedWorker: email,
      status: { $in: ["assigned", "in-progress"] }
    }).toArray();

    console.log(`✅ Found ${jobs.length} jobs for worker ${email}`);
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("❌ Error fetching worker jobs:", error);
    res.status(500).json({ success: false, error: "Failed to fetch worker jobs" });
  }
});

// Mark job as complete
router.put("/complete/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const { workerEmail } = req.body;

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");

    const result = await requestsCollection.updateOne(
      { _id: new ObjectId(jobId), assignedWorker: workerEmail },
      { $set: { status: "completed", completedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Job not found or not assigned to this worker" });
    }

    res.json({ success: true, message: "Job marked as completed" });
  } catch (error) {
    console.error("Error completing job:", error);
    res.status(500).json({ success: false, error: "Failed to complete job" });
  }
});

// Get worker's payment history
router.get("/payments/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = getDB();
    const paymentsCollection = db.collection("payments");

    const payments = await paymentsCollection.find({ 
      workerEmail: email 
    }).toArray();

    res.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, error: "Failed to fetch payment history" });
  }
});

// Get worker's reviews
router.get("/reviews/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = getDB();
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection.find({ 
      workerEmail: email 
    }).toArray();

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

// Assign worker to request
router.put("/assign", async (req, res) => {
  try {
    const { requestId, workerEmail } = req.body;
    
    if (!requestId || !workerEmail) {
      return res.status(400).json({ 
        success: false, 
        error: "Request ID and worker email are required" 
      });
    }

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");
    
    const result = await requestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { 
        $set: { 
          assignedWorker: workerEmail,
          status: "assigned",
          assignedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Request not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Worker assigned successfully" 
    });
  } catch (error) {
    console.error("Error assigning worker:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to assign worker" 
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
