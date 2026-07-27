import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth";
import {
  MdDelete,
  MdDeleteForever,
  MdLogout,
  MdOutlineDeleteForever,
} from "react-icons/md";

const Profile = () => {
  const { user, logout, setUser, resetAuth } = useAuth();
  const navigate = useNavigate();
  const deleteModalRef = useRef(null);
  const [deleting, setDeleting] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    company: user?.company || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalDetailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.updateUserAccount(profileData);
      console.log(res);
      toast.success("User account updated successfully!");
      const responseData = await AuthService.getCurrentUser();
      setUser(responseData.data);
    } catch (err) {
      if (err.response?.status === 500) {
        toast.error("Updation failed!!");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newProfileImage = new FormData();
    newProfileImage.append("profileImage", file);

    try {
      const res = await AuthService.updateProfileImage(newProfileImage);
      console.log(res);
      toast.success("User image updated successfully!");
      const responseData = await AuthService.getCurrentUser();
      setUser(responseData.data);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Profile image updation failed!!");
      }
    }
    console.log("Uploading image file...");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordData({
        ...passwordData,
        confirmPassword: "",
        newPassword: "",
      });
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await AuthService.changeCurrentPassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Invalid Current Password!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    }
  };

  const openDeleteModal = () => {
    deleteModalRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteModalRef.current?.close();
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await AuthService.deleteAccount();
      toast.success("Account deleted successfully");
      resetAuth();
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h2
          className={`text-center text-2xl font-bold ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"}`}
        >
          Account Settings
        </h2>
        <p className="text-sm text-base-content/60 text-center">
          Manage your profile information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Management */}
        <div className="bg-secondary/10 border border-base-300 rounded-2xl p-6 flex flex-col items-center text-center h-fit">
          <div className="relative group w-28 h-28 mb-4">
            <img
              src={user?.profileImage || "/avatar.jpg"}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover border-4 border-base-300 ${user?.role === "organizer" ? "group-hover:border-primary" : "group-hover:border-[color-mix(in_srgb,var(--color-secondary)_80%,#fff)]"} transition duration-200`}
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <h2
            className={`text-xl font-bold ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"}`}
          >
            {profileData.firstName || "User"}{" "}
            {profileData.lastName || "Profile"}
          </h2>
          <p className="text-sm text-base-content/70 mb-6">
            {profileData.company || ""}
          </p>
          <button
            onClick={logout}
            className="w-full btn btn-outline btn-error btn-sm rounded-xl"
          >
            <MdLogout className="text-lg" />
            Log Out
          </button>

          <button
            type="button"
            onClick={openDeleteModal}
            className="w-full btn btn-outline btn-error btn-sm rounded-xl mt-2"
          >
            <MdOutlineDeleteForever className="text-lg" />
            Delete Account
          </button>

          {/* Delete Confirmation Modal */}
          <dialog ref={deleteModalRef} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-error">Delete Account</h3>
              <p className="py-4 text-sm text-base-content/70">
                Are you sure you want to delete your account permanently? This
                action cannot be undone, and all your data will be lost.
              </p>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-sm rounded-xl"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-error btn-sm rounded-xl"
                  onClick={deleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
            {/* backdrop click closes modal */}
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Personal Information */}
          <div className="bg-secondary/10 border border-base-300 rounded-2xl p-6">
            <h3
              className={`text-lg font-semiboldmb-4 ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"}`}
            >
              Personal Details
            </h3>
            <form onSubmit={handlePersonalDetailSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs font-medium">Last Name</label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs font-medium">Company</label>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={`btn rounded-xl px-6 text-sm ${user?.role === "organizer" ? "btn-primary" : "btn-secondary"}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Password Security Management */}
          <div className="bg-secondary/10 border border-base-300 rounded-2xl p-6">
            <h3
              className={`text-lg font-semibold mb-4 ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"}`}
            >
              Security & Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="label text-xs font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full rounded-xl text-sm"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="input input-bordered w-full rounded-xl text-sm"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={`btn btn-outline rounded-xl px-6 text-sm ${user?.role === "organizer" ? "btn-primary" : "btn-secondary"}`}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
