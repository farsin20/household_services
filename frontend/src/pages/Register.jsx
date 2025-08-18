import React, { useState } from "react";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

const Register = () => {
  const { createUser, logOut } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    userType: "customer", // or "employee"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Registering..");
    // Basic validation (add more as needed)
    if (formData?.password.length < 6) {
      toast.error("Password is less than 6 characters");
      return;
    } else if (!/[A-Z]/.test(formData?.password)) {
      toast.error("Password don't have a capital letter");
      return;
    } else if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(formData?.password)) {
      toast.error("Password don't have a special character");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Form Data:", formData);
    // Submit logic here
    // creatingUser
    createUser(formData?.email, formData?.password)
  .then((userCredential) => {
    const user = userCredential.user;

    // Prepare the user data to save in MongoDB
    const savedUser = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      userType: formData.userType,
      uid: user.uid // Store Firebase UID too
    };

    // ✅ Send POST request to your backend
    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(savedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("User saved in MongoDB:", data);
        toast.success("Registration successful", { id: toastId });
        logOut(); // optional
        navigate("/login");
      })
      .catch((error) => {
        toast.error("MongoDB save failed");
        console.error(error);
      });
  })
  .catch((error) => {
    toast.error("Firebase registration failed");
    console.error(error);
  });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-white p-8 m-5 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-emerald-500">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Register As
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            >
              <option value="customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Worker">Worker</option>
              
              {/* <option value="employee">Employee</option> */}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
