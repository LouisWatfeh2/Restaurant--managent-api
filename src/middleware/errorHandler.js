import config from "../config/config.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // ID بصيغة غلط
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // قيمة مكررة (unique)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // فشل validation بـ Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // توكن غلط أو منتهي
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  // لوغ بالتيرمينال بالرسالة الحقيقية
  console.error(`[${req.method}] ${req.originalUrl} -> ${statusCode}: ${message}`);

  // أخطاء 500 بالإنتاج: رسالة عامة
  if (statusCode === 500 && config.nodeEnv === "production") {
    message = "Internal server error";
  }

  const response = { message };
  if (config.nodeEnv === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;