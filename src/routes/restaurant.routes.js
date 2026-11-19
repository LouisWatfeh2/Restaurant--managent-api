import express from "express";
import {
  getRestaurants,
  getRestaurant,
  getRestaurantMeals,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
} from "../controllers/restaurant.controller.js";
import validate from "../middleware/validate.js";
import { protect, authorize } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from "../middleware/restaurant.validation.js";

const router = express.Router();
const ownerOrAdmin = authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN);

router.get("/", getRestaurants);
router.get("/owner/my-restaurants", protect, ownerOrAdmin, getMyRestaurants);
router.get("/:id", getRestaurant);
router.get("/:id/meals", getRestaurantMeals);

router.post(
  "/",
  protect,
  ownerOrAdmin,
  validate(createRestaurantSchema),
  createRestaurant
);
router.put(
  "/:id",
  protect,
  ownerOrAdmin,
  validate(updateRestaurantSchema),
  updateRestaurant
);
router.delete("/:id", protect, ownerOrAdmin, deleteRestaurant);

export default router;