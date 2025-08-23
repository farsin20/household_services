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
    userType: "Customer",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password.length > 128) {
      return "Password must be less than 128 characters";
    }
    if (!/[A-Z]/.test(formData.password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(formData.password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-[\]{};':"\\|,.<>?]/.test(formData.password)) {
      return "Password must contain at least one special character";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      return "Please enter a valid phone number";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1. Form submission started with data:", formData); // Log form data on submission
    setIsSubmitting(true);
    const toastId = toast.loading("Registering..");
    console.log("2. Toast loading displayed, toastId:", toastId); // Confirm toast is triggered

    const validationError = validateForm();
    if (validationError) {
      console.log("3. Validation failed:", validationError); // Log validation error
      toast.error(validationError, { id: toastId });
      setIsSubmitting(false);
      console.log("4. Submission stopped due to validation error");
      return;
    }
    console.log("3. Validation passed, proceeding to Firebase"); // Confirm validation success

    console.log("4. Calling createUser with:", formData.email, formData.password); // Log Firebase attempt
    createUser(formData.email, formData.password)
      .then((userCredential) => {
        console.log("5. Firebase user created, UID:", userCredential.user.uid); // Log successful Firebase auth
        const savedUser = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          userType: formData.userType,
          uid: userCredential.user.uid,
        };
        console.log("6. Prepared API payload:", savedUser); // Log data sent to API
        console.log("7. API URL:", process.env.REACT_APP_API_URL || "http://localhost:5000"); // Log API URL

        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(savedUser),
        })
          .then((res) => {
            console.log("8. API response status:", res.status); // Log API response status
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("9. API response data:", data); // Log API response body
            toast.success("Registration successful", { id: toastId });
            console.log("10. Toast success displayed, resetting form"); // Confirm toast success
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              address: "",
              password: "",
              confirmPassword: "",
              userType: "Customer",
            });
            console.log("11. Form reset, attempting logout"); // Log form reset and logout attempt
            logOut()
              .then(() => {
                console.log("12. Logout successful, navigating to /login"); // Log successful logout
                navigate("/login");
              })
              .catch((error) => {
                console.error("13. Logout error:", error.message); // Log logout error
                toast.error("Logout failed", { id: toastId });
              });
          })
          .catch((error) => {
            console.error("14. API error:", error.message); // Log API error
            toast.error("Failed to save user data", { id: toastId });
          })
          .finally(() => {
            console.log("15. Submission complete, isSubmitting set to false"); // Log end of process
            setIsSubmitting(false);
          });
      })
      .catch((error) => {
        console.error("16. Firebase error:", error.code, error.message); // Log Firebase error
        let errorMessage = "Firebase registration failed";
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak";
        }
        toast.error(errorMessage, { id: toastId });
        setIsSubmitting(false);
        console.log("17. Firebase error handled, submission stopped"); // Log error handling
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-white p-8 m-4 sm:m-5 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-emerald-500">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-1 font-medium text-gray-700">
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="userType" className="block mb-1 font-medium text-gray-700">
              Register As
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full text-black px-4 py-2 border rounded-md focus:ring focus:ring-blue-400"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Worker">Worker</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
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