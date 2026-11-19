import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    description: {
      type: String,
      required: [true, "Restaurant description is required"],
    },
    cuisine: {
      type: [String],
      required: [true, "Cuisine is required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one cuisine is required",
      },
    },
    address: {
      street: { type: String, required: [true, "Street is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      zipCode: { type: String, required: [true, "Zip code is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
    contact: {
      phone: { type: String, required: [true, "Contact phone is required"] },
      email: { type: String, required: [true, "Contact email is required"] },
    },
    openingHours: { type: Object },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: "default-restaurant.jpg" },
  },
  { timestamps: true }
);
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ "address.city": 1 });
restaurantSchema.index({ cuisine: 1 });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;