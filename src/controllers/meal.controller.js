import Meal from "../entities/Meal.js";
import Restaurant from "../entities/Restaurant.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { USER_ROLES } from "../utils/constants.js";
import { buildMealFilter } from "../utils/queryHelpers.js";

const getManagedRestaurant = async (restaurantId, user) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new AppError("Restaurant not found", 404);
  }

  const isOwner = restaurant.owner.toString() === user._id.toString();
  if (!isOwner && user.role !== USER_ROLES.ADMIN) {
    throw new AppError(
      "You can only manage meals of your own restaurants",
      403
    );
  }

  return restaurant;
};

export const getMeals = catchAsync(async (req, res) => {
  const filter = buildMealFilter(req.query);
  filter.isAvailable = true;
  const meals = await Meal.find(filter).populate("restaurant", "name");

  res.status(200).json({ success: true, count: meals.length, data: meals });
});

export const getMeal = catchAsync(async (req, res) => {
  const meal = await Meal.findById(req.params.id).populate(
    "restaurant",
    "name"
  );
  if (!meal) {
    throw new AppError("Meal not found", 404);
  }

  res.status(200).json({ success: true, data: meal });
});

export const createMeal = catchAsync(async (req, res) => {
  await getManagedRestaurant(req.body.restaurant, req.user);

  const meal = await Meal.create(req.body);

  res.status(201).json({ success: true, data: meal });
});

export const updateMeal = catchAsync(async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal) {
    throw new AppError("Meal not found", 404);
  }
  await getManagedRestaurant(meal.restaurant, req.user);

  delete req.body.restaurant;
  meal.set(req.body);
  await meal.save();

  res.status(200).json({ success: true, data: meal });
});

export const deleteMeal = catchAsync(async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal) {
    throw new AppError("Meal not found", 404);
  }
  await getManagedRestaurant(meal.restaurant, req.user);

  await meal.deleteOne();

  res.status(200).json({ success: true, message: "Meal deleted successfully" });
});