import Joi from "joi";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeMessage = { "string.pattern.base": "{{#label}} must be in HH:MM format" };

const dayHours = Joi.object({
  open: Joi.string().pattern(timePattern).required().messages(timeMessage),
  close: Joi.string().pattern(timePattern).required().messages(timeMessage),
});

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const fields = {
  name: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(500),
  cuisine: Joi.array().items(Joi.string()).min(1),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  contact: Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
  openingHours: Joi.object().pattern(Joi.string().valid(...days), dayHours),
  image: Joi.string(),
  isActive: Joi.boolean(),
};


export const createRestaurantSchema = Joi.object(fields).fork(
  ["name", "description", "cuisine", "address", "contact"],
  (schema) => schema.required()
);

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(10).max(1000),
  cuisine: Joi.string().trim().min(2).max(50),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    zipCode: Joi.string().trim(),
    country: Joi.string().trim(),
  }).min(1),
  contact: Joi.object({
    phone: Joi.string().trim(),
    email: Joi.string().trim().email(),
  }).min(1),
  isActive: Joi.boolean(),
}).min(1);