import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const initialFormState = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const { login, user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Logged in successfully!");
      setFormData(initialFormState);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("All fields are required");
      }
      if (err.response?.status === 401) {
        setFormData({...formData,password:""});
        toast.error("Invalid user credentials");
      }
      if (err.response?.status === 404) {
        setFormData(initialFormState);
        toast.error("User not registered!!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden py-12">
      {/* Background Decorative Glows */}
      <div className="absolute pointer-events-none -top-40 -left-40 w-160 h-160 rounded-full bg-primary/20 blur-[140px] opacity-75" />
      <div className="absolute pointer-events-none -bottom-40 -right-40 w-180 h-180 rounded-full bg-base-100/30 blur-[160px]" />

      {/* Heading */}
      <div className="mb-8 z-10">
        <h1 className="text-primary font-bold text-4xl tracking-wide">
          SponsorSync
        </h1>
        <p className="text-base-content/60 mt-2 text-sm max-w-xs sm:max-w-none">
          Log back into the high-fidelity sponsorship marketplace.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-lg bg-base-300/10 border border-base-300/60 rounded-xl p-6 sm:p-9 shadow-2xl text-left z-10">
        <form onSubmit={handleLogin}>
          {/* Fields */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono uppercase text-xs font-medium text-base-content/60">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="john.doe@gmail.com"
              className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <div className="flex justify-between items-center">
              <label className="font-mono uppercase text-xs font-medium text-base-content/60">
                Password
              </label>
            </div>
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-base-100/80 font-bold text-sm h-12 shadow-accent"
          >
            Sign In
          </button>

          <div className="text-center mt-5 text-xs text-base-content/50">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-semibold ml-1"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
