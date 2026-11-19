const R = {
  200: { description: "Success" },
  201: { description: "Created" },
  400: { description: "Validation error or invalid ID" },
  401: { description: "Missing or invalid token" },
  403: { description: "Insufficient permissions" },
  404: { description: "Not found" },
};

const pick = (...codes) =>
  Object.fromEntries(codes.map((code) => [code, R[code]]));

const op = (tag, summary, extra = {}, codes = [200]) => ({
  tags: [tag],
  summary,
  ...extra,
  responses: pick(...codes),
});

const secured = [{ bearerAuth: [] }];

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
  description: "MongoDB ObjectId",
};

const query = (name, description) => ({
  name,
  in: "query",
  required: false,
  schema: { type: "string" },
  description,
});

const body = (example) => ({
  required: true,
  content: { "application/json": { schema: { type: "object", example } } },
});

const mealFilters = [
  query("category", "appetizer, main course, dessert, beverage, side dish"),
  query("restaurant", "Restaurant ID"),
  query("minPrice", "Minimum price"),
  query("maxPrice", "Maximum price"),
  query("isVegetarian", "true or false"),
  query("isVegan", "true or false"),
];

const restaurantExample = {
  name: "Taste of India",
  description: "Authentic Indian cuisine with rich flavors",
  cuisine: ["Indian", "Asian"],
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India",
  },
  contact: { phone: "+91-1234567890", email: "contact@tasteofindia.com" },
  openingHours: { monday: { open: "09:00", close: "22:00" } },
};

const mealExample = {
  name: "Chicken Biryani",
  restaurant: "RESTAURANT_ID",
  description: "Fragrant basmati rice with tender chicken",
  price: 12.99,
  category: "main course",
  ingredients: ["Basmati rice", "Chicken", "Spices"],
  calories: 650,
  preparationTime: 30,
  isSpicy: true,
};

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Restaurant Management System API",
    version: "1.0.0",
    description: "Backend API for restaurants, meals and users with JWT auth.",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    "/api/auth/register": {
      post: op(
        "Auth",
        "Register a new user",
        {
          requestBody: body({
            name: "John Doe",
            email: "john@example.com",
            password: "securePassword123",
            role: "restaurant_owner",
          }),
        },
        [201, 400]
      ),
    },
    "/api/auth/login": {
      post: op(
        "Auth",
        "Login and get a token",
        {
          requestBody: body({
            email: "john@example.com",
            password: "securePassword123",
          }),
        },
        [200, 401]
      ),
    },
    "/api/auth/me": {
      get: op("Auth", "Get current user profile", { security: secured }, [200, 401]),
    },
    "/api/restaurants": {
      get: op("Restaurants", "Get all active restaurants"),
      post: op(
        "Restaurants",
        "Create a restaurant (Owner/Admin)",
        { security: secured, requestBody: body(restaurantExample) },
        [201, 400, 401, 403]
      ),
    },
    "/api/restaurants/owner/my-restaurants": {
      get: op(
        "Restaurants",
        "Get the current owner's restaurants (Owner/Admin)",
        { security: secured },
        [200, 401, 403]
      ),
    },
    "/api/restaurants/{id}": {
      get: op(
        "Restaurants",
        "Get a single restaurant",
        { parameters: [idParam] },
        [200, 400, 404]
      ),
      put: op(
        "Restaurants",
        "Update a restaurant (Owner/Admin)",
        {
          security: secured,
          parameters: [idParam],
          requestBody: body({ description: "Updated description for the restaurant" }),
        },
        [200, 400, 403, 404]
      ),
      delete: op(
        "Restaurants",
        "Delete a restaurant and its meals (Owner/Admin)",
        { security: secured, parameters: [idParam] },
        [200, 403, 404]
      ),
    },
    "/api/restaurants/{id}/meals": {
      get: op(
        "Restaurants",
        "Get all meals of a restaurant",
        { parameters: [idParam] },
        [200, 404]
      ),
    },
    "/api/meals": {
      get: op("Meals", "Get all meals with filters", { parameters: mealFilters }),
      post: op(
        "Meals",
        "Create a meal (Owner/Admin)",
        { security: secured, requestBody: body(mealExample) },
        [201, 400, 403, 404]
      ),
    },
    "/api/meals/{id}": {
      get: op("Meals", "Get a single meal", { parameters: [idParam] }, [200, 404]),
      put: op(
        "Meals",
        "Update a meal (Owner/Admin)",
        { security: secured, parameters: [idParam], requestBody: body({ price: 14.5 }) },
        [200, 400, 403, 404]
      ),
      delete: op(
        "Meals",
        "Delete a meal (Owner/Admin)",
        { security: secured, parameters: [idParam] },
        [200, 403, 404]
      ),
    },
    "/api/client/meals": {
      get: op(
        "Client",
        "Meals with advanced filters and text search (Client)",
        {
          security: secured,
          parameters: [
            ...mealFilters,
            query("search", "Text search in name, description, ingredients"),
            query("isGlutenFree", "true or false"),
            query("isSpicy", "true or false"),
          ],
        },
        [200, 401, 403]
      ),
    },
    "/api/client/restaurants": {
      get: op(
        "Client",
        "Restaurants filtered by city and cuisine (Client)",
        {
          security: secured,
          parameters: [
            query("city", "City name"),
            query("cuisine", "Cuisine type"),
            query("search", "Text search in name and description"),
          ],
        },
        [200, 401, 403]
      ),
    },
    "/api/client/restaurants/{id}": {
      get: op(
        "Client",
        "Restaurant with its meals (Client)",
        { security: secured, parameters: [idParam] },
        [200, 401, 403, 404]
      ),
    },
    "/api/client/categories": {
      get: op(
        "Client",
        "All meal categories (Client)",
        { security: secured },
        [200, 401, 403]
      ),
    },
  },
};

export default swaggerSpec; 