import Restaurant from "../entities/Restaurant.js";
import Meal from "../entities/Meal.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { USER_ROLES } from "../utils/constants.js";

const checkOwnership = (restaurant, user) => {
  const isOwner = restaurant.owner.toString() === user._id.toString();
  if (!isOwner && user.role !== USER_ROLES.ADMIN) {
    throw new AppError("You can only manage your own restaurants", 403);
  }
};

export const getRestaurants = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true }).populate(
    "owner",
    "name email"
  );

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants,
  });
});

export const getRestaurant = catchAsync(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate(
    "owner",
    "name email"
  );
  if (!restaurant) {
    throw new AppError("Restaurant not found", 404);
  }

  res.status(200).json({ success: true, data: restaurant });
});

export const getRestaurantMeals = catchAsync(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    isActive: true,
  });
  if (!restaurant) {
    throw new AppError("Restaurant not found", 404);
  }

  const meals = await Meal.find({
    restaurant: restaurant._id,
    isAvailable: true,
  });

  res.status(200).json({ success: true, count: meals.length, data: meals });
});

export const createRestaurant = catchAsync(async (req, res) => {
  const restaurant = await Restaurant.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: restaurant });
});

export const updateRestaurant = catchAsync(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new AppError("Restaurant not found", 404);
  }
  checkOwnership(restaurant, req.user);

  restaurant.set(req.body);
  await restaurant.save();

  res.status(200).json({ success: true, data: restaurant });
});

export const deleteRestaurant = catchAsync(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    throw new AppError("Restaurant not found", 404);
  }
  checkOwnership(restaurant, req.user);

  await Meal.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.status(200).json({
    success: true,
    message: "Restaurant and its meals deleted successfully",
  });
});

export const getMyRestaurants = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user._id });

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants,
  });
});