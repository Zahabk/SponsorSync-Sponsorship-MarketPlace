import Api from "./api.js";

const AuthService = {
  register: async (userData) => {
    const res = await Api.post("users/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  login: async (credentials) => {
    const res = await Api.post("users/login", credentials);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await Api.get("users/current-user");
    return res.data;
  },
  logout: async () => {
    const res = await Api.get("users/logout");
    return res.data;
  },
  updateUserAccount: async (updatedDetails) => {
    const res = await Api.patch("users/account", updatedDetails);
    return res.data;
  },
  changeCurrentPassword: async (newPassword) => {
    const res = await Api.patch("users/password", newPassword);
    return res.data;
  },
  updateAvatar: async (newAvatar) => {
    const res = await Api.patch("users/avatar", newAvatar, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteAccount: async () => {
    const res = await Api.delete("users/");
    return res.data;
  },
};

export default AuthService;
