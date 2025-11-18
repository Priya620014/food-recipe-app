
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import registerImage from "../assets/register1.png";
import BackgroundImage from "../assets/background.jpg";
import { BACKEND_URL } from "../config/config";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const Email = email.toLowerCase();

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setShowError(true);
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character"
      );
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: Email, password }),
      });

      if (response.ok) {
        const user = await response.json();

        if (user.error) {
          toast.warn("User already exists. Try a different email");
        } else {
          toast.success("Registration successful");
          localStorage.setItem("token", user.token);
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        }
      }
    } catch {
      toast.error("Error registering user");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white/40 backdrop-blur-md border border-[#F4A261] shadow-2xl rounded-2xl overflow-hidden">
        <div className="w-full md:w-1/2 flex justify-center md:block p-6">
          <img
            src={registerImage}
            alt="Register"
            className="w-40 h-40 md:w-full md:h-full object-cover rounded-full md:rounded-none"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit}>
            <h2 className="text-4xl font-bold text-[#2A9D8F] mb-8 text-center">
              Create Account
            </h2>

            <div className="mb-5 flex items-center border border-[#F4A261] rounded-md px-3 py-2 bg-white">
              <FaUser className="text-[#2A9D8F] mr-2" />
              <input
                type="text"
                className="w-full px-2 py-1 focus:outline-none bg-white"
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-5 flex items-center border border-[#F4A261] rounded-md px-3 py-2 bg-white">
              <FaEnvelope className="text-[#2A9D8F] mr-2" />
              <input
                type="email"
                className="w-full px-2 py-1 focus:outline-none bg-white"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 flex items-center border border-[#F4A261] rounded-md px-3 py-2 bg-white">
              <FaLock className="text-[#2A9D8F] mr-2" />
              <input
                type="password"
                className="w-full px-2 py-1 focus:outline-none bg-white"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-3 bg-[#E63946] text-white rounded-lg hover:opacity-90 transition duration-300 text-lg font-semibold"
            >
              Sign Up
            </button>

            <div className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#2A9D8F] font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </form>

          {showError && (
            <div className="mt-4 text-red-500 text-center font-medium">
              Please fill all the fields
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
