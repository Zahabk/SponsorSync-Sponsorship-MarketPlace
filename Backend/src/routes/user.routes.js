import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changeAvatar,
  changePassword,
  deleteUserAccount,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

//secured routes

router.route("/all").get( getAllUsers);

router.route("/logout").get(verifyJWT, logoutUser);
router.route("/").get(verifyJWT, getCurrentUser);
router.route("/account").patch(verifyJWT, updateAccountDetails);
router.route("/password").patch(verifyJWT, changePassword);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), changeAvatar);
router.route("/").delete(verifyJWT, deleteUserAccount);

export default router;
