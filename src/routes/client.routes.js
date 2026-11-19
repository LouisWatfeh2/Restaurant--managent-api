import express from "express";
import {
  getMeals,
  getRestaurants,
  getRestaurantById,
  getCategories,
} from "../controllers/client.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect, authorize(USER_ROLES.CLIENT));

router.get("/meals", getMeals);
router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.get("/categories", getCategories);

export default router;