# Restaurant Management API

A REST API for managing restaurants and their menus. It provides JWT-based authentication, role-based access control, restaurant and meal management, and client-facing search and filtering.

## Features

- User registration and login with signed JWTs
- Three user roles: `client`, `restaurant_owner`, and `admin`
- Restaurant and meal management with ownership checks
- Public restaurant and meal listings
- Client-only restaurant and meal search and filtering
- Request validation, centralized error handling, security headers, and rate limiting
- Interactive API documentation with Swagger UI

## Technology

Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Joi, Helmet, CORS, and express-rate-limit.

## Getting Started

### Run with Docker Compose

Docker Compose starts the API and MongoDB:

```bash
docker compose up --build
```

The API is available at `http://localhost:3000`. To stop the services, run:

```bash
docker compose down
```

The Compose configuration uses a demo JWT secret. Replace it before using the service outside local development.

### Run locally

You need Node.js and a MongoDB instance available to the application.

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env`.

3. Set `JWT_SECRET` in `.env` to a private, sufficiently strong value. Check that `MONGODB_URI` points to your MongoDB instance.

4. Start the server:

   ```bash
   npm start
   ```

The server connects to MongoDB before it starts listening.

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Port used by the API server | `3000` |
| `NODE_ENV` | Runtime environment; controls error details | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/restaurant_db` |
| `JWT_SECRET` | Secret used to sign and verify tokens | Required |
| `JWT_EXPIRE` | Token lifetime | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin; use `*` to allow any origin | `*` |

`JWT_EXPIRES_IN` is also accepted as an alternative to `JWT_EXPIRE`.

## API Documentation

With the server running, open Swagger UI at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

### Authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Authenticated |

Registration creates a `client` by default. You can request the `restaurant_owner` role; public registration does not allow creating an `admin` account. Passwords must be 6-128 characters and include at least one letter and one number.

Example registration request:

```json
{
  "name": "Jordan Lee",
  "email": "jordan@example.com",
  "password": "SecurePass123",
  "role": "restaurant_owner"
}
```

Register and login responses include a `token` and a user object. Send the token with protected requests:

```http
Authorization: Bearer <token>
```

### Restaurants

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/restaurants` | Public; lists active restaurants |
| `GET` | `/api/restaurants/:id` | Public; retrieves an active restaurant |
| `GET` | `/api/restaurants/:id/meals` | Public; lists available meals for an active restaurant |
| `GET` | `/api/restaurants/owner/my-restaurants` | Restaurant owner or admin |
| `POST` | `/api/restaurants` | Restaurant owner or admin |
| `PUT` | `/api/restaurants/:id` | Restaurant owner or admin; owners can update their own restaurants |
| `DELETE` | `/api/restaurants/:id` | Restaurant owner or admin; owners can delete their own restaurants |

Creating a restaurant requires `name`, `description`, a non-empty `cuisine` array, `address`, and `contact`. The authenticated owner is assigned automatically.

### Meals

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/meals` | Public; lists available meals |
| `GET` | `/api/meals/:id` | Public |
| `POST` | `/api/meals` | Restaurant owner or admin |
| `PUT` | `/api/meals/:id` | Restaurant owner or admin; owners can update meals at their own restaurants |
| `DELETE` | `/api/meals/:id` | Restaurant owner or admin; owners can delete meals at their own restaurants |

Creating a meal requires `name`, `restaurant` (a restaurant ID), `description`, `price`, `category`, a non-empty `ingredients` array, and `preparationTime`. Categories are `appetizer`, `main course`, `dessert`, `beverage`, and `side dish`.

The public `GET /api/meals` endpoint accepts these optional query parameters:

| Parameter | Description |
| --- | --- |
| `category` | One of the supported meal categories |
| `restaurant` | Restaurant ID |
| `minPrice`, `maxPrice` | Inclusive price bounds |
| `isVegetarian`, `isVegan` | `true` or `false` |

### Client endpoints

All `/api/client` endpoints require a valid token for a user with the `client` role.

| Method | Endpoint | Optional query parameters |
| --- | --- | --- |
| `GET` | `/api/client/meals` | `category`, `restaurant`, `minPrice`, `maxPrice`, `isVegetarian`, `isVegan`, `isGlutenFree`, `isSpicy`, `search` |
| `GET` | `/api/client/restaurants` | `city`, `cuisine`, `search` |
| `GET` | `/api/client/restaurants/:id` | None |
| `GET` | `/api/client/categories` | None |

Meal search checks meal names, descriptions, and ingredients. Restaurant search checks names and descriptions; `city` and `cuisine` are exact, case-insensitive matches. Boolean query values must be `true` or `false`.

## Responses and Errors

Successful responses generally include `success: true` and return their result in `data`. Collection responses also include a `count`.

Errors use this shape:

```json
{
  "message": "Description of the error"
}
```

In development, the response also includes a `stack` property. Common status codes include:

| Status | Meaning |
| --- | --- |
| `400` | Invalid input, ID, or duplicate value |
| `401` | Missing or invalid token, or invalid credentials |
| `403` | The authenticated user does not have permission |
| `404` | Resource or route not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

## Security

Passwords are hashed with bcrypt using 10 salt rounds. The API validates request bodies, applies Helmet security headers, and limits requests by IP: authentication routes allow 20 requests per 15 minutes, while restaurant, meal, and client API routes allow 100 requests per 15 minutes. Keep `JWT_SECRET` private and use a production-appropriate value before deployment.

## Project Structure

```text
src/
  config/       Application, database, and Swagger configuration
  controllers/  Authentication, restaurant, meal, and client handlers
  entities/     Mongoose models for users, restaurants, and meals
  middleware/   Authentication, validation, and error handling
  routes/       API route definitions
  utils/        Errors, shared constants, and query helpers
app.js          Express application setup
server.js       Database connection and server startup
```
