# E-Commerce Auth & Product CRUD

Sheryians Coding School assignment — JWT access + refresh token authentication,
Product CRUD APIs with express-validator, and a React frontend.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, express-validator
- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios

## Project Structure

```
.
├── server/            Express + MongoDB API
│   └── src/
│       ├── config/        DB connection
│       ├── models/        User, Product schemas
│       ├── controllers/   Auth + Product business logic
│       ├── middlewares/   authenticate, validateRequest, errorHandler
│       ├── routes/        authRoutes, productRoutes
│       ├── validators/    express-validator chains
│       ├── utils/         token generation, cookie options
│       ├── app.js
│       └── server.js
└── client/            React (Vite) frontend
    └── src/
        ├── api/            axios instance with auto refresh-on-401
        ├── context/        AuthContext (user session state)
        ├── components/     Navbar, ProtectedRoute
        └── pages/          Login, Register, Products, ProductForm
```

## How Auth Works

1. **Register** — password hashed with bcrypt (10 salt rounds), no tokens issued.
2. **Login** — verifies password, issues:
   - a short-lived **access token** (returned in the JSON response body)
   - a long-lived **refresh token** (set as an `httpOnly` cookie, scoped to `/api/auth`)
   - a bcrypt hash of the refresh token is stored on the user document for revocation
3. **Protected routes** — the `authenticate` middleware reads `Authorization: Bearer <token>`,
   verifies it, and attaches `req.user`.
4. **Refresh** — `POST /api/auth/refresh-token` reads the cookie, verifies it against the
   stored hash, and **rotates** both tokens (issues new ones, invalidates the old refresh token).
   The frontend's axios interceptor calls this automatically whenever a request gets a 401.
5. **Logout** — clears the stored refresh-token hash and the cookie.

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

`.env` values you need to fill in:

| Variable | What it is |
|---|---|
| `MONGO_URI` | Your MongoDB connection string (Atlas or local) |
| `ACCESS_TOKEN_SECRET` | Random string, e.g. `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `REFRESH_TOKEN_SECRET` | Same as above — use a **different** random string |
| `CLIENT_URL` | Your frontend's URL (for CORS + cookies), e.g. `http://localhost:5173` |

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL to your backend's URL, e.g. http://localhost:5000/api
npm run dev
```

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new user account |
| POST | `/login` | Public | Authenticate, issue access token + refresh cookie |
| POST | `/refresh-token` | Public (needs refresh cookie) | Issue a new access token (rotates refresh token) |
| POST | `/logout` | Authenticated | Invalidate the refresh token |
| GET | `/me` | Authenticated | Return the logged-in user's profile |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Authenticated | Create a new product |
| GET | `/` | Public | List all products (`?page=&limit=`) |
| GET | `/:id` | Public | Get a single product |
| PUT | `/:id` | Authenticated | Update a product |
| DELETE | `/:id` | Authenticated | Delete a product |

## Notes

- `node_modules/` is not included — run `npm install` in both `server/` and `client/`.
- Never commit your real `.env` file — only `.env.example` is tracked.
