import React, { useState, useEffect } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const { user, role } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const workerEmail = user?.email;

  useEffect(() => {
    if (!user || role !== "worker") {
      navigate("/login");
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-500">
        Worker Dashboard
      </h1>

      <div className="flex justify-center mb-4 space-x-4 text-emerald-500">
        <button
          onClick={() => setActiveTab("jobs")}
          className="btn-tab bg-white rounded p-4"
        >
          My Jobs
        </button>
        <button
          onClick={() => setActiveTab("complete")}
          className="btn-tab bg-white rounded p-4"
        >
          Mark Complete
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className="btn-tab bg-white rounded p-4"
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className="btn-tab bg-white rounded p-4"
        >
          Customer Reviews
        </button>
      </div>

      <div className="bg-transparent shadow-xl rounded p-6">
        {activeTab === "jobs" && <MyJobs workerEmail={workerEmail} />}
        {activeTab === "complete" && <MarkComplete workerEmail={workerEmail} />}
        {activeTab === "payments" && <PaymentHistory workerEmail={workerEmail} />}
        {activeTab === "reviews" && <WorkerReviews workerEmail={workerEmail} />}
      </div>
    </div>
  );
};

// Show all jobs assigned to worker
const MyJobs = ({ workerEmail }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests/worker/${workerEmail}`
        );
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [workerEmail]);

  if (loading) return <p className="text-white">Loading jobs...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        Your Assigned Jobs
      </h2>
      <ul className="list-disc space-y-3 text-black">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job._id} className="p-3 bg-gray-100 rounded">
              {job.serviceType} - {job.preferredDate} - {job.description} -{" "}
              <span className="font-semibold">{job.status}</span>
            </li>
          ))
        ) : (
          <li className="text-white">No jobs assigned yet.</li>
        )}
      </ul>
    </div>
  );
};

// Worker marks job as completed
const MarkComplete = ({ workerEmail }) => {
  const [jobId, setJobId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/complete/${jobId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workerEmail }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Job marked as completed!");
        setJobId("");
      } else {
        alert("Failed to update job.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        Mark Job as Completed
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="input w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Complete Job
        </button>
      </form>
    </div>
  );
};

// Worker payment history
const PaymentHistory = ({ workerEmail }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests/payments/${workerEmail}`
        );
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [workerEmail]);

  if (loading) return <p className="text-white">Loading payments...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        Payment History
      </h2>
      <ul className="list-disc space-y-3 text-black">
        {payments.length > 0 ? (
          payments.map((pay) => (
            <li key={pay._id} className="p-3 bg-gray-100 rounded">
              {pay.serviceId} - ${pay.amount} - {pay.date}
            </li>
          ))
        ) : (
          <li className="text-white">No payments yet.</li>
        )}
      </ul>
    </div>
  );
};

// Worker reviews from customers
const WorkerReviews = ({ workerEmail }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/requests/reviews/${workerEmail}`
        );
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [workerEmail]);

  if (loading) return <p className="text-white">Loading reviews...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">
        Customer Reviews
      </h2>
      <ul className="list-disc space-y-3 text-black">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <li key={rev._id} className="p-3 bg-gray-100 rounded">
              <span className="font-bold">{rev.customerName}</span>:{" "}
              {rev.comment} ({rev.rating}/5)
            </li>
          ))
        ) : (
          <li className="text-white">No reviews yet.</li>
        )}
      </ul>
    </div>
  );
};

export default WorkerDashboard;
