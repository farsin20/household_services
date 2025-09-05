import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import { toast } from "react-hot-toast";

const generateJobId = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const RequestService = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    serviceType: "",
    preferredDate: "",
    description: "",
    jobId: generateJobId(),
    status: "pending",
    customerEmail: user?.email || "",
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first to request a service");
      navigate("/login");
      return;
    }

    const toastId = toast.loading("Submitting service request...");

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Service request submitted successfully! Your Job ID is: ${formData.jobId}`, {
          id: toastId,
          duration: 5000,
        });
        
        // Reset form with a new job ID but keep user info
        setFormData({
          name: user?.displayName || "",
          email: user?.email || "",
          phone: "",
          address: "",
          serviceType: "",
          preferredDate: "",
          description: "",
          jobId: generateJobId(),
          status: "pending",
          customerEmail: user?.email || "",
          createdAt: new Date().toISOString(),
        });
        
        // Navigate to customer dashboard after short delay
        setTimeout(() => {
          navigate("/customer-dashboard");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to submit service request", { id: toastId });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-500">Request a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-black">Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          >
            <option value="">Select a service</option>
            <option value="plumbing">Plumbing</option>
            <option value="cleaning">Cleaning</option>
            <option value="electrician">Electrician</option>
            <option value="pestControl">Pest Control</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Preferred Date</label>
          <input
            name="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-black">Additional Details</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your issue or request"
            className="w-full border text-black border-gray-300 rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Request
        </button>
      </form>
      <button onClick={()=> Navigate(-1)} className="mt-3 w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Go Back</button>
    </div>
  );
};

export default RequestService;
