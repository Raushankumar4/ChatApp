import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { response } from "../utils/responseHandler.js";
import bcrypt from "bcrypt";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return response.error(res, "All fields are required!", 400);
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return response.error(res, "User Already exist with this email", 409);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });
  if (!user) {
    return response.error(res, "Something went wrong!", 500);
  }
  return response.success(res, "Registered", user, 201);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return response.error(res, "All fields are required!", 400);
  }
  let user = await User.findOne({ email });
  if (!user) {
    return response.error(res, "User Not Found with this email", 404);
  }
  const comparedPassword = await bcrypt.compare(password, user.password);
  if (!comparedPassword) {
    return response.error(res, "Incorrect password!", 401);
  }
  const token = generateToken(user);

  res.cookie(token, "token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ token: token });
});

const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return response.success(res, "Logout successful");
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.json(user);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const users = await User.find({ _id: { $ne: userId } }).select(
    "username email _id"
  );

  res.status(200).json(users);
});
export { registerUser, loginUser, logOut, getProfile };
