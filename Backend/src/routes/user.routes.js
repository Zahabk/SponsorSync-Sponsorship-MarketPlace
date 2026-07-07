import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changePassword,
  changeProfileImage,
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

router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginUser);
router.route("/all").get(getAllUsers);

//secured routes

router.route("/logout").get(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/account").patch(verifyJWT, updateAccountDetails);
router.route("/password").patch(verifyJWT, changePassword);
router
  .route("/profileImage")
  .patch(verifyJWT, upload.single("profileImage"), changeProfileImage);
router.route("/").delete(verifyJWT, deleteUserAccount);

export default router;
