import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../entities/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { USER_ROLES } from "../utils/constants.js";

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || USER_ROLES.CLIENT,
    phone,
    address,
  });

  res.status(201).json({
    success: true,
    token: signToken(user._id),
    user: formatUser(user),
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    throw new AppError("No account found with this email", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Incorrect password", 401);
  }

  res.status(200).json({
    success: true,
    token: signToken(user._id),
    user: formatUser(user),
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});