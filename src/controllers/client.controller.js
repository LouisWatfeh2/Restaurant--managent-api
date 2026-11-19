import Restaurant from  "../entities/Restaurant.js";
import Meal from "../entities/Meal.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { MEAL_CATEGORIES } from "../utils/constants.js";
import { buildMealFilter, escapeRegex } from "../utils/queryHelpers.js";

export const getMeals = catchAsync(async (req, res) => {
  const filter = buildMealFilter(req.query);
  filter.isAvailable = true;
  const { search, isGlutenFree, isSpicy } = req.query;

  if (isGlutenFree !== undefined) {
    if (isGlutenFree !== "true" && isGlutenFree !== "false") {
      throw new AppError("isGlutenFree must be true or false", 400);
    }
    filter.isGlutenFree = isGlutenFree === "true";
  }
  if (isSpicy !== undefined) {
    if (isSpicy !== "true" && isSpicy !== "false") {
      throw new AppError("isSpicy must be true or false", 400);
    }
    filter.isSpicy = isSpicy === "true";
  }

  if (typeof search === "string" && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { name: regex },
      { description: regex },
      { ingredients: regex },
    ];
  }

  const meals = await Meal.find(filter).populate("restaurant", "name");

  res.status(200).json({ success: true, count: meals.length, data: meals });
});

export const getRestaurants = catchAsync(async (req, res) => {
  const { city, cuisine, search } = req.query;
  const filter = { isActive: true };

  if (typeof city === "string" && city.trim()) {
    filter["address.city"] = new RegExp(`^${escapeRegex(city.trim())}$`, "i");
  }
  if (typeof cuisine === "string" && cuisine.trim()) {
    filter.cuisine = new RegExp(`^${escapeRegex(cuisine.trim())}$`, "i");   
  }
  if (typeof search === "string" && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const restaurants = await Restaurant.find(filter);

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants,
  });
});

export const getRestaurantById = catchAsync(async (req, res) => {
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

  res.status(200).json({
    success: true,
    data: { ...restaurant.toObject(), meals },
  });
});

export const getCategories = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    count: MEAL_CATEGORIES.length,
    data: MEAL_CATEGORIES,
  });
});