import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';

const RequestsList = ({userEmail}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`http://localhost:5000/api/requests/${userEmail}`);
        const data = await res.json();
        if (data.success) {
          setRequests(data.requests);
          setError(null);
        } else {
          setError("Failed to fetch requests");
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        setError("Error connecting to server");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail]);

  if (loading) {
    return <div className="text-emerald-400">Loading your requests...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">My Service Requests</h3>
      <div className="grid gap-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-white p-4 rounded-lg shadow-md border border-emerald-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="block text-sm text-emerald-600 font-medium mb-1">
                    Job ID: {request.jobId || request._id}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {request.serviceType}
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : request.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="grid gap-2 text-gray-600 text-sm">
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {request.description || "No description provided"}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {request.address}
                </p>
                {request.assignedWorker && (
                  <p>
                    <span className="font-medium">Assigned Worker:</span>{" "}
                    {request.assignedWorker}
                  </p>
                )}
                {request.completionNotes && (
                  <p>
                    <span className="font-medium">Completion Notes:</span>{" "}
                    {request.completionNotes}
                  </p>
                )}
                <div className="text-gray-400 text-xs mt-2">
                  <p>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
                  {request.completedAt && (
                    <p>Completed on: {new Date(request.completedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-emerald-400">No service requests found.</p>
        )}
      </div>
    </div>
  );
};

const MakePayment = ({userEmail}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    const fetchUnpaidRequests = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/requests/${userEmail}`);
        const data = await res.json();
        if (data.success) {
          // Filter requests that are completed but not paid
          const unpaidRequests = data.requests.filter(req => 
            req.status === "completed" && (!req.paymentStatus || req.paymentStatus === "pending")
          );
          setRequests(unpaidRequests);
          setError(null);
        } else {
          setError("Failed to fetch requests");
        }
      } catch (error) {
        setError("Error connecting to server");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnpaidRequests();
  }, [userEmail]);

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setPaymentAmount(request.amount || '');
  };

  const handleUpdateAmount = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !paymentAmount) {
      alert('Please select a request and enter an amount');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/requests/updateAmount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          amount: paymentAmount
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update the amount in the local state
        setRequests(prev => prev.map(req => 
          req._id === selectedRequest._id 
            ? { ...req, amount: paymentAmount }
            : req
        ));
        alert('Amount updated successfully!');
        setSelectedRequest(null);
        setPaymentAmount('');
      } else {
        alert('Failed to update amount: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating amount:', error);
      alert('Error updating amount. Please try again.');
    }
  };

  const handlePayment = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          paymentStatus: 'paid',
          paymentDate: new Date().toISOString()
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Remove the paid request from the list
        setRequests(prev => prev.filter(req => req._id !== requestId));
        alert('Payment successful!');
        setSelectedRequest(null);
        setPaymentAmount('');
      } else {
        alert('Payment failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-emerald-400">Loading payment information...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">Pending Payments</h3>
      
      {/* Amount Update Form */}
      {selectedRequest && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h4 className="text-lg font-semibold text-black mb-2">Update Payment Amount</h4>
          <form onSubmit={handleUpdateAmount} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Type: {selectedRequest.serviceType}
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Worker: {selectedRequest.assignedWorker}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="mt-1 block w-full pl-7 pr-12 text-black border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              >
                Update Amount
              </button>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded-lg shadow">
              <div className="text-black">
                <h4 className="font-semibold">{request.serviceType}</h4>
                <p className="text-sm text-gray-600">Worker: {request.assignedWorker}</p>
                <p className="text-sm text-gray-600">Date: {new Date(request.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Amount: ${request.amount || 'Not set'}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleSelectRequest(request)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update Amount
                  </button>
                  {request.amount && (
                    <button
                      onClick={() => handlePayment(request._id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-emerald-400">No pending payments.</p>
        )}
      </div>
    </div>
  );
};

const ReviewService = ({userEmail}) => {
  const [formData, setFormData] = useState({
    jobId: "",
    rating: "5",
    reviewText: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedJobs, setCompletedJobs] = useState([]);

  useEffect(() => {
    // Fetch completed jobs for the customer
    const fetchCompletedJobs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/requests/completed/${userEmail}`);
        const data = await res.json();
        if (data.success) {
          setCompletedJobs(data.requests);
        }
      } catch (error) {
        console.error('Error fetching completed jobs:', error);
      }
    };

    if (userEmail) {
      fetchCompletedJobs();
    }
  }, [userEmail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerEmail: userEmail,
          submittedAt: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Review submitted successfully!');
        setFormData({
          jobId: "",
          rating: "5",
          reviewText: "",
        });
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-emerald-400">Review Service</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Job
          </label>
          <select
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            required
            className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-emerald-500"
          >
            <option value="">Select a completed job</option>
            {completedJobs.map((job) => (
              <option key={job._id} value={job.jobId}>
                {job.jobId} - {job.serviceType} ({new Date(job.completedAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Rating
          </label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-emerald-500"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Very Poor</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Your Review
          </label>
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            required
            rows="4"
            className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-emerald-500"
            placeholder="Please share your experience with the service..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const userEmail = user?.email;

  useEffect(() => {
    if (!user || role !== 'customer') {
      navigate('/login');
    }
  }, [user, role, navigate]);

  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-500">Customer Dashboard</h1>

      <div className="flex justify-center mb-4 space-x-4 text-emerald-500">
        <button 
          onClick={() => setActiveTab('requests')} 
          className={`btn-tab ${activeTab === 'requests' ? 'bg-emerald-500 text-white' : 'bg-white'} rounded p-4`}
        >
          My Requests
        </button>
        <button 
          onClick={() => setActiveTab('payment')} 
          className={`btn-tab ${activeTab === 'payment' ? 'bg-emerald-500 text-white' : 'bg-white'} rounded p-4`}
        >
          Make Payment
        </button>
        <button 
          onClick={() => setActiveTab('review')} 
          className={`btn-tab ${activeTab === 'review' ? 'bg-emerald-500 text-white' : 'bg-white'} rounded p-4`}
        >
          Review Service
        </button>
        <Link to='/request-services'>
          <button className="btn-tab bg-white rounded p-4">New Request</button>
        </Link>
      </div>

      <div className="bg-transparent shadow-xl rounded p-6">
        {activeTab === 'requests' && <RequestsList userEmail={userEmail} />}
        {activeTab === 'payment' && <MakePayment userEmail={userEmail} />}
        {activeTab === 'review' && <ReviewService userEmail={userEmail} />}
      </div>
    </div>
  );
};

export default CustomerDashboard;
