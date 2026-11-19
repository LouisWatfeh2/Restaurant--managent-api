# Restaurant Management System - Backend API

RESTful API for managing restaurants and meals, with JWT authentication and role-based access control (Admin, Restaurant Owner, Client).

## Tech Stack

Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens, bcryptjs, Joi, dotenv, CORS, express-rate-limit

## Getting Started

### Option 1: Docker (includes MongoDB)

docker compose up --build
The API runs on http://localhost:3000


### Option 2: Local

Requirements: Node.js and a running MongoDB instance.

npm install
cp .env.example .env
npm start
```

### Tests

```bash
npm test
```
## Environment Variables

| Variable | Description |
|---|---|
| PORT | Server port (3000) |
| NODE_ENV | development or production |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign tokens |
| JWT_EXPIRE | Token expiry (7d) |

## Project Structure

src/
  config/        config.js, data-base.js
  controllers/   auth, restaurant, meal, client
  entities/      User, Restaurant, Meal (Mongoose models)
  middleware/    auth, validate, validations, errorHandler, notFound
  routes/        auth, restaurant, meal, client
  utils/         AppError, catchAsync, constants, queryHelpers
app.js
server.js
## API Endpoints

documentation: http://localhost:3000/api/docs.

### Authentication (/api/auth)

| Method | Endpoint | Access |
|---|---|---|
| POST | /register | Public |
| POST | /login | Public |
| GET | /me | Private |

### Restaurants (/api/restaurants)

| Method | Endpoint | Access |
|---|---|---|
| GET | / | Public |
| GET | /:id | Public |
| GET | /:id/meals | Public |
| POST | / | Owner / Admin |
| PUT | /:id | Owner / Admin |
| DELETE | /:id | Owner / Admin |
| GET | /owner/my-restaurants | Owner / Admin |

### Meals (/api/meals)

| Method | Endpoint | Access |
|---|---|---|
| GET | / | Public |
| GET | /:id | Public |
| POST | / | Owner / Admin |
| PUT | /:id | Owner / Admin |
| DELETE | /:id | Owner / Admin |

Query parameters for GET /api/meals: category, restaurant, minPrice, maxPrice, isVegetarian, isVegan.

### Client (/api/client) - Client role only

| Method | Endpoint | Description |
|---|---|---|
| GET | /meals | Meals with advanced filters and text search |
| GET | /restaurants | Restaurants filtered by city and cuisine |
| GET | /restaurants/:id | Restaurant with its meals |
| GET | /categories | All meal categories |

Authenticated requests need the header: Authorization: Bearer <token>

## Error Handling

Every error returns:

{ "message": "Error description", "stack": "(development only)" }
| Status | Meaning |
|---|---|
| 400 | Validation error, invalid ID, duplicate value |
| 401 | Missing or invalid token, wrong credentials |
| 403 | Insufficient permissions |
| 404 | Resource or route not found |
| 429 | Too many requests |
| 500 | Internal server error |

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 minutes per IP
- Joi validation on request bodies
- Centralized error handling