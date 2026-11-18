# kitchenwise-diet-profile-service

A microservice responsible for storing and managing user diet profiles. Part of the KitchenWise application — a full-stack microservice architecture for personalized meal planning and local grocery store discovery.

---

## Overview

This service manages each user's dietary profile — the core data used to personalize meal plans throughout the application. It stores age, sex, weight, height, activity level, dietary preferences, and budget level. The same object can be posted as-is to kitchenwise-meal-plan-service `/api/meal-plan` to generate a meal plan.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** JavaScript (ES modules)
- **Framework:** Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWTs issued by user-auth-service

---

## Features

- Create and store user diet profiles
- Retrieve diet profiles by user
- Update existing diet profiles
- Delete diet profiles

---

## API Endpoints

All routes except `/api/health` require an `Authorization: Bearer <token>` header with a JWT from user-auth-service. The user ID is taken from the token, never from the request body.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (public) |
| POST | `/api/create-nutritional-profile` | Create the user's diet profile (returns 201 and the saved profile; 409 if the user already has one) |
| GET | `/api/get-nutritional-profile` | Retrieve the user's diet profile (404 if none) |
| PATCH | `/api/update-nutritional-profile` | Update the user's diet profile (returns the updated profile) |
| DELETE | `/api/delete-nutritional-profile` | Delete the user's diet profile |

---

## Diet Profile Schema

Request body for create and update. Enum values are case-sensitive. `dietaryPreferences` is optional on create and defaults to `["Normal"]`. Update changes only the fields you send. Invalid values return `400`.

```typescript
{
  age: number
  sex: "male" | "female"
  weight: number   // kg
  height: number   // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active"
  dietaryPreferences: ("Normal" | "Keto" | "High Protein" | "Vegetarian" | "Vegan")[]
  budgetLevel: "Minimal" | "Normal" | "Premium"
}
```

Example:

```json
{
  "age": 37, "sex": "female", "weight": 65, "height": 175,
  "activityLevel": "moderate", "dietaryPreferences": ["Normal"], "budgetLevel": "Normal"
}
```

Stored documents also have `_id`, `userId` (from the token), and `createdAt`.

Each user has at most one profile, enforced by a unique index on `userId`. To change an existing profile, use the update route.

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If MongoDB can't be reached, the service logs the error and keeps running: `/api/health` still responds, and database routes return 500.

`JWT_SECRET` must match the secret used by user-auth-service.

---

## Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB connection string (`MONGO_URI`)

### Installation

```bash
git clone https://github.com/GreatDeveloper66/kitchenwise-diet-profile-service.git
cd kitchenwise-diet-profile-service
npm install
```

### Running

The app is deployed on Vercel, which imports the Express app exported from `src/server.js`.

`npm run dev` and `npm start` both run `node src/server.js`, which listens on `PORT` (default 3000). Vercel imports the same file and does not use that listener. There is no build step.

---

## Project Architecture

This repository is one of seven components in the KitchenWise application (six backend microservices plus the React frontend):

| Repository | Responsibility |
|---------|---------------|
| [kitchenwise-frontend](https://github.com/GreatDeveloper66/kitchenwise-frontend) | React + TypeScript frontend |
| [user-auth-service](https://github.com/GreatDeveloper66/user-auth-service) | Authentication & JWT management |
| **[kitchenwise-diet-profile-service](https://github.com/GreatDeveloper66/kitchenwise-diet-profile-service)** | Diet profile storage & management |
| [kitchenwise-meal-plan-service](https://github.com/GreatDeveloper66/kitchenwise-meal-plan-service) | AI-powered meal plan generation |
| [kitchenwise-plan-storage-service](https://github.com/GreatDeveloper66/kitchenwise-plan-storage-service) | User meal plan storage |
| [kitchenwise-grocery-service](https://github.com/GreatDeveloper66/kitchenwise-grocery-service) | Grocery store discovery by location (Google Places) |
| [kitchenwise-recipe-service](https://github.com/GreatDeveloper66/kitchenwise-recipe-service) | AI recipe generation |
