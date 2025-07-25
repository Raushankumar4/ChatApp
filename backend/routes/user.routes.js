import { Router } from "express";
import {
  getAllUsers,
  getProfile,
  loginUser,
  logOut,
  registerUser,
} from "../controllers/auth.controller.js";
import { isAuthenticatedUser } from "../middleware/isAuthenticated.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOut);
router.route("/user").get(isAuthenticatedUser, getProfile);
router.route("/users").get(isAuthenticatedUser, getAllUsers);

export default router;
