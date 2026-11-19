import AppError from "./AppError.js";
import { MEAL_CATEGORIES } from "./constants.js";

export const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toNumber = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new AppError(`${name} must be a number`, 400);
  }
  return number;
};

const toBoolean = (value, name) => {
  if (value !== "true" && value !== "false") {
    throw new AppError(`${name} must be true or false`, 400);
  }
  return value === "true";
};

export const buildMealFilter = (query) => {
  const filter = {};

  if (query.category) {
    if (!MEAL_CATEGORIES.includes(query.category)) {
      throw new AppError("Invalid meal category", 400);
    }
    filter.category = query.category;
  }
  if (query.restaurant) {
    if (!/^[0-9a-fA-F]{24}$/.test(query.restaurant)) {
      throw new AppError("restaurant must be a valid ID", 400);
    }
    filter.restaurant = query.restaurant;
  }

  const hasMinPrice = query.minPrice !== undefined && query.minPrice !== "";
  const hasMaxPrice = query.maxPrice !== undefined && query.maxPrice !== "";

  if (hasMinPrice || hasMaxPrice) {
    filter.price = {};
    if (hasMinPrice) {
      filter.price.$gte = toNumber(query.minPrice, "minPrice");
    }
    if (hasMaxPrice) {
      filter.price.$lte = toNumber(query.maxPrice, "maxPrice");
    }
    if (
      filter.price.$gte !== undefined &&
      filter.price.$lte !== undefined &&
      filter.price.$gte > filter.price.$lte
    ) {
      throw new AppError("minPrice cannot be greater than maxPrice", 400);
    }
  }

  if (query.isVegetarian !== undefined) {
    filter.isVegetarian = toBoolean(query.isVegetarian, "isVegetarian");
  }
  if (query.isVegan !== undefined) {
    filter.isVegan = toBoolean(query.isVegan, "isVegan");
  }

  return filter;
};