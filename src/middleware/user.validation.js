import Joi from "joi";
import { USER_ROLES } from "../utils/constants.js";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(/[A-Za-z]/)
    .pattern(/\d/)
    .required(),
  role: Joi.string().valid(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.CLIENT),
  phone: Joi.string(),
  address: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});