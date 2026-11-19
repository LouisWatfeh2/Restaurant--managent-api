import Joi from "joi";
import { MEAL_CATEGORIES } from "../utils/constants.js";

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ "string.pattern.base": "{{#label}} must be a valid ID" });

const fields = {
  name: Joi.string().min(2).max(100),
  restaurant: objectId,
  description: Joi.string().min(5).max(500),
  price: Joi.number().min(0),
  category: Joi.string().valid(...MEAL_CATEGORIES),
  ingredients: Joi.array().items(Joi.string()).min(1),
  calories: Joi.number().min(0),
  isVegetarian: Joi.boolean(),
  isVegan: Joi.boolean(),
  isGlutenFree: Joi.boolean(),
  isSpicy: Joi.boolean(),
  preparationTime: Joi.number().min(0),
  isAvailable: Joi.boolean(),
  image: Joi.string(),
};

export const createMealSchema = Joi.object(fields).fork(
  ["name", "restaurant", "description", "price", "category", "ingredients", "preparationTime"],
  (schema) => schema.required()
);

export const updateMealSchema = Joi.object(fields).min(1);