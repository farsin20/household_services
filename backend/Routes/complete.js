const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// PUT route to mark a job as complete
router.put('/api/requests/complete', async (req, res) => {
  try {
    const { jobId, workerEmail, completionNotes, completedAt } = req.body;

    if (!jobId || !workerEmail) {
      return res.status(400).json({
        success: false,
        error: "Job ID and worker email are required"
      });
    }

    // Find the request and update its status
    const request = await Request.findById(jobId);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Job not found"
      });
    }

    // Verify that this job belongs to the worker
    if (request.assignedWorker !== workerEmail) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to complete this job"
      });
    }

    // Update the request status
    request.status = "completed";
    request.completionNotes = completionNotes;
    request.completedAt = completedAt;

    await request.save();

    res.json({
      success: true,
      message: "Job marked as completed successfully",
      job: request
    });

  } catch (error) {
    console.error("Error completing job:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

module.exports = router;
