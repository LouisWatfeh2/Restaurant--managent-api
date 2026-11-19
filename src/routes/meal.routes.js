import express from "express";
import {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.controller.js";
import validate from "../middleware/validate.js";
import { protect, authorize } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";
import {
  createMealSchema,
  updateMealSchema,
} from "../middleware/meal.validation.js";

const router = express.Router();
const ownerOrAdmin = authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN);

router.get("/", getMeals);
router.get("/:id", getMeal);

router.post("/", protect, ownerOrAdmin, validate(createMealSchema), createMeal);
router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  validate(updateMealSchema),
  updateMeal
);
router.delete("/:id", protect, ownerOrAdmin, deleteMeal);

export default router;