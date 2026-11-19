import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import {
  registerSchema,
  loginSchema,
} from "../middleware/user.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;