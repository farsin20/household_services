import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const RequestService = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    preferredDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

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
      alert("Service request submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        serviceType: "",
        preferredDate: "",
        description: "",
      });
    } else {
      alert("Failed to submit service request.");
    }
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Something went wrong. Please try again.");
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
