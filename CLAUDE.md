# kitchenwise-diet-profile-service

Stores each user's diet profile, which feeds meal plan generation. Branch: `master`. Deployed at https://meal-plan-diet-profile-service.vercel.app (old name, do not rename).

Stack: Node.js, Express, plain JavaScript (ES modules, not TypeScript), MongoDB via Mongoose. Routes are in `src/server.js`, handlers in `controllers/nutritionalProfileController.js`, model in `models/nutritionalProfile.js`. `src/server.js` exports the app for Vercel and calls `app.listen(PORT || 3000)` only when run directly (`npm run dev` / `npm start`).

## Routes

All routes except health and hello take `Authorization: Bearer <token>` from user-auth-service. Each handler verifies the JWT inline and reads the user ID from its `id` claim.

| Method | Route |
|---|---|
| GET | /api/health |
| GET | /api/hello (test route) |
| POST | /api/create-nutritional-profile |
| GET | /api/get-nutritional-profile |
| PATCH | /api/update-nutritional-profile |
| DELETE | /api/delete-nutritional-profile |

## Model (the real contract; Postman and the README match it)

```json
{ "age": 37, "sex": "female", "weight": 65, "height": 175,
  "activityLevel": "moderate", "dietaryPreferences": ["Normal"], "budgetLevel": "Normal" }
```

- `sex`: `male | female`. `weight` kg, `height` cm, plain numbers.
- `activityLevel`: `sedentary | light | moderate | active | very active`.
- `dietaryPreferences`: array of `Normal | Keto | High Protein | Vegetarian | Vegan`.
- `budgetLevel`: `Minimal | Normal | Premium`.
- `dietaryPreferences` defaults to `['Normal']`. PATCH runs validators and only changes fields present in the body (Mongoose drops undefined keys). Validation and cast errors return 400.
- One profile per user: create returns 409 if one exists, backed by a unique index on `userId` (built 2026-11-17).

Env: `MONGO_URI` (required). A connection failure is logged, not fatal: health keeps working, DB routes 500. Also `JWT_SECRET`.

## Known issues

None open.

## Rules

- This profile shape is also the input to kitchenwise-meal-plan-service `/api/meal-plan`. Keep the two in step, and flag any field rename as a cross-repo change. (Meal-plan's validator also accepts `sex: "other"`, which this model rejects.)
