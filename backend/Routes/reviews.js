const express = require("express");
const router = express.Router();
const { getDB } = require("../db");
const { ObjectId } = require('mongodb');

// POST /api/reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const {
      jobId,
      customerEmail,
      rating,
      reviewText,
      submittedAt
    } = req.body;

    // Validate required fields
    if (!jobId || !customerEmail || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const db = getDB();
    const requestsCollection = db.collection("serviceRequests");
    const reviewsCollection = db.collection("reviews");

    // Find the service request to get the worker's email
    const request = await requestsCollection.findOne({ jobId });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Service request not found"
      });
    }

    // Verify that the review is from the customer who received the service
    if (request.customerEmail !== customerEmail) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to review this service"
      });
    }

    // Check if a review already exists for this job
    const existingReview = await reviewsCollection.findOne({ jobId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "A review already exists for this job"
      });
    }

    // Create the review
    const review = {
      jobId,
      customerEmail,
      workerEmail: request.assignedWorker,
      serviceType: request.serviceType,
      rating: parseInt(rating),
      reviewText,
      submittedAt: new Date(submittedAt),
      jobCompletedAt: request.completedAt
    };

    // Insert the review
    const result = await reviewsCollection.insertOne(review);

    // Update the service request to mark it as reviewed
    await requestsCollection.updateOne(
      { jobId },
      { $set: { reviewed: true, reviewId: result.insertedId } }
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: {
        ...review,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit review"
    });
  }
});

// GET /api/reviews/worker/:email - Get all reviews for a worker
router.get("/worker/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = getDB();
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection
      .find({ workerEmail: email })
      .sort({ submittedAt: -1 })
      .toArray();

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error("Error fetching worker reviews:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews"
    });
  }
});

module.exports = router;
