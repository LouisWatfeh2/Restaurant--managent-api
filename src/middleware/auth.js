import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../entities/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication token is missing", 401);
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, config.jwtSecret);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new AppError("The user belonging to this token no longer exists", 401);
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};