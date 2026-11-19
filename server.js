import  app from "./app.js";
import connectDB from "./src/config/data-base.js";
import config from "./src/config/config.js";

async function startServer() {
    try {
    if (!config.jwtSecret) {
      throw new Error("JWT_SECRET is required");
    }
    await connectDB();
    app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    });
} catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
}
}

startServer();