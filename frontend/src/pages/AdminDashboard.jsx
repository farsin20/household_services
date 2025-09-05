import React from "react";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");

  const handleAssignWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/requests/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest,
          workerEmail: selectedWorker
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh requests after successful assignment
        const requestsRes = await fetch("http://localhost:5000/api/requests");
        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setRequests(requestsData.requests);
        }
        // Reset selections
        setSelectedRequest("");
        setSelectedWorker("");
        alert("Worker assigned successfully!");
      } else {
        alert("Failed to assign worker: " + data.error);
      }
    } catch (error) {
      console.error("Error assigning worker:", error);
      alert("Error assigning worker. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch requests
        const requestsRes = await fetch("http://localhost:5000/api/requests");
        const requestsData = await requestsRes.json();
        console.log("Fetched requests:", requestsData);
        if (requestsData.success) {
          setRequests(requestsData.requests);
        }

        // Fetch workers
        const workersRes = await fetch("http://localhost:5000/api/users/workers");
        const workersData = await workersRes.json();
        console.log("Fetched workers data:", workersData);
        if (workersData.success) {
          setWorkers(workersData.workers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-500">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


        {/* Requests Section */}
        <div className="bg-transparent rounded-xl shadow-xl p-5 text-emerald-400">
          <h2 className="text-xl font-semibold mb-4">Service Requests</h2>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {requests.map((req) => (
              <li key={req._id} className="p-3 border rounded-md bg-white text-black">
                Request from <strong>{req.name}</strong> for <strong>{req.serviceType}</strong>
                <div className="text-sm text-gray-600">Status: {req.status}</div>
              </li>
            ))}
            {requests.length === 0 && (
              <li className="text-sm text-gray-400">No requests found.</li>
            )}
          </ul>
        </div>

        {/* Assign Worker Section */}
        <div className="bg-transparent rounded-xl shadow-xl p-5 text-emerald-400 ">
          <h2 className="text-xl font-semibold mb-4">Assign Workers</h2>
          <form className="space-y-4" onSubmit={handleAssignWorker}>
            <div>
              <label className="block text-sm font-medium">Select Request</label>
              <select 
                className="w-full border p-2 rounded hover:text-black"
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                required
              >
                <option value="">Select a request</option>
                {requests
                  .filter(req => req.status === "pending")
                  .map((req) => (
                    <option key={req._id} value={req._id}>
                      {req.name} - {req.serviceType}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Select Worker</label>
              <select 
                className="w-full border p-2 rounded hover:text-black"
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                required
              >
                <option value="">Select a worker</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker.email}>
                    {worker.fullName} ({worker.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Assign
            </button>
          </form>
        </div>

        {/* Payment Status Section */}
        <div className="bg-transparent rounded-lg shadow-md p-5 text-emerald-400">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {requests
              .filter(req => req.status === "completed")
              .map((req) => (
                <li key={req._id} className="p-3 border rounded-md bg-white text-black">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{req.name}</span>
                      <p className="text-sm text-gray-600">{req.serviceType}</p>
                    </div>
                    <div>
                      {req.paymentStatus === "paid" ? (
                        <span className="text-green-600 font-semibold">Paid</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Pending</span>
                      )}
                      {req.paymentDate && (
                        <p className="text-xs text-gray-500">
                          {new Date(req.paymentDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            {requests.filter(req => req.status === "completed").length === 0 && (
              <li className="text-sm text-gray-400">No completed services found.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
