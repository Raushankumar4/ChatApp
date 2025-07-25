import jwt from "jsonwebtoken";
import { response } from "../utils/responseHandler.js";

export const isAuthenticatedUser = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization?.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return response.error(res, "Invalid token or session expired", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return response.error(res, "Unauthorized access", 401);
  }
};
