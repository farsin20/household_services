import React, { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider"; // Adjust path if different
import { Link } from "react-router"; 

const Navbar = () => {
  const { user, logOut,role } = useContext(AuthContext);
  console.log("User in Navbar:", role);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-emerald-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Household Services</h1>
      <div className="space-x-4">
        <a href="/" className="hover:underline font-bold">Home</a>

        {user && user.email ? (
          <>
            {role === "Admin" ? (
              <Link to="/admin_dashboard" className="hover:underline font-bold hover:text-yellow-300">
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/customer_dashboard" className="hover:underline font-bold hover:text-green-300">
                Customer Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="hover:underline font-bold hover:text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline font-bold hover:text-blue-700">Login</Link>
            <Link to="/register" className="hover:underline font-bold hover:text-red-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
