import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { options } from "../constants.js";
import { sendEmail } from "../utils/sendEmail.js";

//generate token
const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();

    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password, role, company } =
    req.body;

  if (
    [username, email, firstName, lastName, password, role, company].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists ");
  }

  const profileImageLocalPath = req.file?.path;
  let profileImageUrl = "";

  if (profileImageLocalPath) {
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!profileImage?.url) {
      throw new ApiError(
        400,
        "Error while uploading profile image on cloudinary",
      );
    }
    profileImageUrl = profileImage.url;
  }

  const user = await User.create({
    username: username.toLowerCase(),
    firstName,
    lastName,
    email,
    password,
    role,
    company,
    profileImage: profileImageUrl,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //Welcome mail sent to user
  // try {
  //   await sendEmail({
  //     to: user.email,
  //     subject: "Welcome to SponsorSync 🎉",
  //     html: `
  //       <div style="font-family: sans-serif; padding: 20px;">
  //         <h2>Hi ${user.fullName},</h2>
  //         <p>Thanks for signing up! Your account has been created successfully.</p>
  //       </div>
  //     `,
  //   });
  // } catch (err) {
  //   console.error("Failed to send welcome email:", err);
  // }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = await generateToken(user._id);

  const userDetails = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged In successfully", {
        userDetails,
        accessToken,
      }),
    );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", req.user));
});

//change user password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

//update user account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, role, company } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        firstName,
        lastName,
        email,
        role,
        company,
      },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User account updated successfully", updatedUser),
    );
});

//change user profileImage
const changeProfileImage = asyncHandler(async (req, res) => {
  const profileImageLocalPath = req.file?.path;

  if (!profileImageLocalPath) {
    throw new ApiError(400, "Profile Image file is required");
  }

  //Find user and extract profileImage url
  const user = await User.findById(req.user?._id);
  const oldProfileImagerUrl = user?.profileImage;

  const profileImage = await uploadOnCloudinary(profileImageLocalPath);

  if (!profileImage.url) {
    throw new ApiError(
      400,
      "Error while uploading profile image on cloudinary",
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profileImage: profileImage.url,
      },
    },
    {
      new: true,
    },
  ).select("-password");

  //if new profile image updated successfully, delete old profile image from cloudinary
  if (oldProfileImagerUrl) {
    const publicId = oldProfileImagerUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile Image changed successfully", updatedUser),
    );
});

//delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted Successfully", {}));
});

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, "All users fetched successfully", users));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  updateAccountDetails,
  changeProfileImage,
  getCurrentUser,
  deleteUserAccount,
  getAllUsers,
};
