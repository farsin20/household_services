import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobIdToComplete, setJobIdToComplete] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completedJobs, setCompletedJobs] = useState([]);
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || role !== "worker") {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const [activeRes, completedRes] = await Promise.all([
          fetch(`http://localhost:5000/api/requests/worker/${user.email}`),
          fetch(`http://localhost:5000/api/requests/worker/${user.email}/completed`)
        ]);

        const [activeData, completedData] = await Promise.all([
          activeRes.json(),
          completedRes.json()
        ]);

        if (activeData.success) {
          setJobs(activeData.jobs || []);
        }
        if (completedData.success) {
          setCompletedJobs(completedData.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const handleJobCompletion = async (e) => {
    e.preventDefault();
    if (!jobIdToComplete) {
      alert("Please enter a Job ID");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/requests/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: jobIdToComplete,
          workerEmail: user.email,
          completionNotes,
          completedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Job marked as completed successfully!");
        setJobIdToComplete("");
        setCompletionNotes("");
        
        // Refresh both active and completed jobs lists
        const [activeRes, completedRes] = await Promise.all([
          fetch(`http://localhost:5000/api/requests/worker/${user.email}`),
          fetch(`http://localhost:5000/api/requests/worker/${user.email}/completed`)
        ]);

        const [activeData, completedData] = await Promise.all([
          activeRes.json(),
          completedRes.json()
        ]);

        if (activeData.success) {
          setJobs(activeData.jobs || []);
        }
        if (completedData.success) {
          setCompletedJobs(completedData.jobs || []);
        }
      } else {
        alert(data.error || "Failed to mark job as completed");
      }
      if (data.success) {
        alert("Job marked as completed successfully!");
        setJobIdToComplete("");
        setCompletionNotes("");
        // Refresh the jobs list
        const refreshedData = await fetch(
          `http://localhost:5000/api/requests/worker/${user.email}`
        );
        const refreshedJobs = await refreshedData.json();
        if (refreshedJobs.success) {
          setJobs(refreshedJobs.jobs || []);
        }
      } else {
        alert(data.error || "Failed to mark job as completed");
      }
    } catch (error) {
      console.error("Error completing job:", error);
      alert("Failed to mark job as completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-500">
        Worker Dashboard
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Job Completion Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">
            Mark Job as Complete
          </h2>
          <form onSubmit={handleJobCompletion} className="space-y-4">
            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
                Job ID
              </label>
              <input
                type="text"
                id="jobId"
                value={jobIdToComplete}
                onChange={(e) => setJobIdToComplete(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Enter Job ID"
                required
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Completion Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                rows="3"
                placeholder="Add any notes about the completed job"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Marking as Complete..." : "Mark as Complete"}
            </button>
          </form>
        </div>

        {/* Active Jobs List */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">
            Your Active Jobs
          </h2>
          <div className="space-y-4">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-semibold text-emerald-600">
                      Job ID: {job.jobId || "N/A"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : job.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="grid gap-2 text-gray-600">
                    <p><span className="font-medium">Service:</span> {job.serviceType}</p>
                    <p><span className="font-medium">Customer:</span> {job.name}</p>
                    <p><span className="font-medium">Address:</span> {job.address}</p>
                    {job.phone && (
                      <p><span className="font-medium">Contact:</span> {job.phone}</p>
                    )}
                    {job.description && (
                      <p><span className="font-medium">Description:</span> {job.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Assigned on: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active jobs assigned.</p>
            )}
          </div>
        </div>

        {/* Completed Jobs List */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-600">
            Completed Jobs
          </h2>
          <div className="space-y-4">
            {completedJobs && completedJobs.length > 0 ? (
              completedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-semibold text-emerald-600">
                      Job ID: {job.jobId || "N/A"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                  <div className="grid gap-2 text-gray-600">
                    <p><span className="font-medium">Service:</span> {job.serviceType}</p>
                    <p><span className="font-medium">Customer:</span> {job.name}</p>
                    <p><span className="font-medium">Address:</span> {job.address}</p>
                    {job.completionNotes && (
                      <p><span className="font-medium">Completion Notes:</span> {job.completionNotes}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Completed on: {new Date(job.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No completed jobs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
