import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useEffect } from 'react';
import { AuthContext } from '../Providers/AuthProvider';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const { user } = React.useContext(AuthContext);
  const userEmail = user?.email;


  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-emerald-500">Customer Dashboard</h1>

      <div className="flex justify-center mb-4 space-x-4 text-emerald-500">
        <button onClick={() => setActiveTab('requests')} className="btn-tab bg-white rounded p-4">My Requests</button>
        <button onClick={() => setActiveTab('payment')} className="btn-tab bg-white rounded p-4">Make Payment</button>
        <button onClick={() => setActiveTab('review')} className="btn-tab bg-white rounded p-4">Review Service</button>
        <Link to='/requestService'><button className="btn-tab bg-white rounded p-4">New Request</button></Link>
      </div>

      <div className="bg-trasparent shadow-xl rounded p-6">
        {activeTab === 'requests' && <MyRequests userEmail={userEmail} />}
        {activeTab === 'payment' && <MakePayment />}
        {activeTab === 'review' && <ReviewService />}
        {activeTab === 'new' && <NewRequestForm />}
      </div>
    </div>
  );
};

const MyRequests = ({userEmail}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // const userEmail = "user@example.com"; // TODO: Replace with dynamic logged-in user's email

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/requests/${userEmail}`);
        const data = await res.json();
        if (data.success) {
          setRequests(data.requests);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail]);

  if (loading) return <p className="text-white">Loading your requests...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Your Service Requests</h2>
      <ul className="list-disc space-y-3 text-black">
        {requests.length > 0 ? (
          requests.map((req) => (
            <li key={req._id} className="p-3 bg-gray-100 rounded">
              {req._id} - {req.serviceType}- {req.preferredDate} - {req.description} - {req.status}
            </li>
          ))
        ) : (
          <li className="text-white">You have no requests.</li>
        )}
      </ul>
    </div>
  );
};



const MakePayment = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
    <form className="space-y-4 flex flex-col">
      <input type="text" placeholder="Service ID" className="input w-full" />
      <input type="number" placeholder="Amount" className="input w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Pay Now</button>
    </form>
  </div>
);

const ReviewService = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Review a Completed Service</h2>
    <form className="space-y-4 flex flex-col">
      <input type="text" placeholder="Service ID" className="input w-full" />
      <textarea placeholder="Write your review..." className="input w-full" rows="4" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit Review</button>
    </form>
  </div>
);



export default CustomerDashboard;
