import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import config from "./src/config/config.js";
import authRoutes from "./src/routes/auth.routes.js";
import restaurantRoutes from "./src/routes/restaurant.routes.js";
import mealRoutes from "./src/routes/meal.routes.js";
import clientRoutes from "./src/routes/client.routes.js";
import notFound from "./src/middleware/notFound.js";
import errorHandler from "./src/middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";
const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: config.corsOrigin !== "*",
}));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many authentication attempts, please try again later" },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { message: "Too many requests, please try again later" },
});

app.use(express.json({ limit: "1mb" }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/restaurants", apiLimiter, restaurantRoutes);
app.use("/api/meals", apiLimiter, mealRoutes);
app.use("/api/client", apiLimiter, clientRoutes);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/client", clientRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;