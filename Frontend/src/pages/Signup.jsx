import React, { useState, useRef } from "react";
import { RiCalendarEventLine, RiUserAddLine } from "react-icons/ri";
import { LuHandshake } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.js";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username:"",
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    password: "",
    role: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }
      console.log(formData);

      if (profileImage) data.append("profileImage", profileImage);

      await AuthService.register(data);
      toast.success("Account created successfully!");
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden py-12 ">
      {/* Background Decorative Glows */}
      <div className="absolute pointer-events-none -top-40 -left-40 w-160 h-160 rounded-full bg-primary/20 blur-[140px] opacity-75" />
      <div className="absolute pointer-events-none -bottom-40 -right-40 w-180 h-180 rounded-full bg-base-100/30 blur-[160px]" />

      {/* Heading  */}
      <div className="mb-8 z-10">
        <h1 className="text-primary font-bold text-4xl tracking-wide">
          SponsorSync
        </h1>
        <p className="text-base-content/60 mt-2 text-sm max-w-xs sm:max-w-none">
          Join the high-fidelity sponsorship marketplace.
        </p>
      </div>

      {/* Form container  */}
      <div className="w-full max-w-lg bg-base-300/10 border border-base-300/60 rounded-xl p-6 sm:p-9 shadow-2xl text-left z-10">
        <form onSubmit={handleSignup}>
          {/* Role Selection Blocks */}
          <div className="mb-6">
            <span className="block text-xs uppercase font-mono font-medium text-base-content/50 tracking-wider mb-3">
              I am a...
            </span>

            <div className="grid grid-cols-2 gap-4">
              {/* Organizer Block */}
              <div
                onClick={() => setFormData({ ...formData, role: "organizer" })}
                className={`border rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                  formData.role === "organizer"
                    ? "border-primary bg-primary/5 shadow-accent"
                    : "border-base-100 hover:border-primary/40 bg-base-300/40"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-primary/10 border border-base-300 rounded-full flex items-center justify-center text-primary text-xl">
                    <RiCalendarEventLine />
                  </div>
                </div>
                <h3 className="font-bold text-[color-mix(in_srgb,var(--color-primary)_15%,#fff)] text-sm sm:text-base">
                  Organizer
                </h3>
                <p className="text-xs text-base-content/50 mt-1 leading-normal">
                  Host premium events and manage proposals.
                </p>
              </div>

              {/* Sponsor Block */}
              <div
                onClick={() => setFormData({ ...formData, role: "sponsor" })}
                className={`border rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                  formData.role === "sponsor"
                    ? "border-primary bg-primary/5 shadow-accent"
                    : "border-base-100 hover:border-primary/40 bg-base-300/40"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-base-300/80 border border-base-300 rounded-full flex items-center justify-center text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)] text-xl">
                    <LuHandshake />
                  </div>
                </div>
                <h3 className="font-bold text-[color-mix(in_srgb,var(--color-secondary)_15%,#fff)] text-sm sm:text-base">
                  Sponsor
                </h3>
                <p className="text-xs text-base-content/50 mt-1 leading-normal">
                  Discover opportunities and high-ROI events.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Image Upload Field */}
          <div className="flex flex-col items-center justify-center mb-6 gap-2">
            <span className="self-start text-xs uppercase font-mono font-medium text-base-content/50 tracking-wider">
              User Avatar
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="group relative w-20 h-20 rounded-full bg-base-300/40 border border-base-300/80 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 hover:border-primary/60"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <RiUserAddLine className="text-base-content/40 text-2xl group-hover:text-primary transition-colors" />
              )}
              {/* Hover overlay text label */}
              <div className="absolute inset-0 bg-base-300/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <span className="text-[10px] font-mono uppercase text-primary font-bold">
                  Upload
                </span>
              </div>
            </div>
          </div>

          {/* Form fields */}

          {/* username  */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono uppercase text-xs font-medium text-base-content/60">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              type="text"
              placeholder="john12"
              className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
              required
            />
          </div>

          {/* first name and last name  */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase font-medium text-base-content/60">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text"
                placeholder="John"
                className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono uppercase text-xs font-medium text-base-content/60">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                type="text"
                placeholder="Doe"
                className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          {/* company  */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono uppercase text-xs font-medium text-base-content/60">
              Company
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              type="text"
              placeholder="Acme Corp"
              className="input input-bordered w-full bg-base-300/50 text-sm focus:border-primary focus:outline-none"
              required
            />
          </div>

          {/* email  */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-mono uppercase text-xs font-medium text-base-content/60">
              Email Address
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

          {/* password  */}
          <div className="flex flex-col gap-1.5 mb-6">
            <label className="font-mono uppercase text-xs font-medium text-base-content/60">
              Password
            </label>
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
            Create Account
          </button>

          <div className="text-center mt-5 text-xs text-base-content/50">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold ml-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
