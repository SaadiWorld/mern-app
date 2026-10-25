# MERN Places — TypeScript Edition

This repository is an enhanced, independently implemented companion to [The Complete React, Node.js, Express & MongoDB (MERN) Stack Guide](https://www.udemy.com/course/react-nodejs-express-mongodb-the-mern-fullstack-guide/) on Udemy. It follows the course's full-stack places-sharing project while using TypeScript across the frontend and backend and a modernized set of dependencies and libraries. Dependency versions are managed in each app's package manifest and may continue to change over time.

This project is for learning and experimentation; it is not an official course project or affiliated with Udemy or the course instructor.

## What the project does

Users can create an account, sign in, browse users and their places, and manage their own place listings. A place includes a title, description, address, and image. The backend resolves addresses to coordinates with OpenStreetMap's Nominatim service, and the frontend displays locations on OpenStreetMap tiles using OpenLayers.

### Frontend

- React 19, TypeScript, and Vite 8 for the single-page application.
- React Router 8 for navigation and authenticated routes.
- Sign-up and login forms, client-side form validation, and authentication context.
- User directory and user-specific place listings.
- Authenticated place creation, editing, and deletion.
- Image upload controls, loading indicators, and error dialogs.
- OpenLayers maps backed by OpenStreetMap tiles.
- Axios for HTTP requests and CSS Modules for component styling.

### Backend

- Node.js, TypeScript, Express 5, and MongoDB with Mongoose 9.
- REST API for users, authentication, and places, under `/api/v1`.
- Password hashing with bcryptjs and token-based authentication with JSON Web Tokens.
- Request validation with express-validator.
- Multipart image uploads with Multer; uploaded images are served from `/uploads/images`.
- Address geocoding through the Nominatim search API.
- Mongoose transactions to keep place records and their creator's place list in sync.
- Centralized error handling and correlation IDs on responses.
- OpenAPI description in `backend/docs/openapi.yaml`.

## Tech stack

| Area                          | Main technologies                                                    |
| ----------------------------- | -------------------------------------------------------------------- |
| Frontend                      | React 19, TypeScript 6, Vite 8, React Router 8, Axios, OpenLayers 10 |
| Backend                       | Node.js, TypeScript 7, Express 5, MongoDB, Mongoose 9, Multer 2      |
| Authentication and validation | JSON Web Token, bcryptjs, express-validator                          |
| Mapping and geocoding         | OpenLayers, OpenStreetMap, Nominatim                                 |

Exact dependency ranges are listed in `frontend/package.json` and `backend/package.json`.

## Getting started

### Prerequisites

- A recent Node.js release with native `.env` loading support.
- npm.
- A MongoDB deployment. Place creation and deletion use database transactions, so use MongoDB Atlas or a local replica set rather than a standalone MongoDB server.

### 1. Configure the backend

Create `backend/.env` with the following values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
APP_NAME=mern-places
APP_EMAIL=you@example.com
```

`APP_NAME` and `APP_EMAIL` identify requests made to Nominatim. Keep real credentials private and do not commit `.env` files.

### 2. Install and start the backend

```sh
cd backend
npm install
npm start
```

The API listens on `http://localhost:5001`.

### 3. Install and start the frontend

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local development URL when it starts. By default, the frontend sends API requests to `http://localhost:5001/api/v1`. To use a different backend URL, create `frontend/.env` and set:

```env
VITE_BACKEND_URL=http://localhost:5001/api/v1
```

Restart the Vite development server after changing environment variables.

## API overview

The API base path is `/api/v1`:

| Method   | Endpoint          | Purpose                                                     | Access              |
| -------- | ----------------- | ----------------------------------------------------------- | ------------------- |
| `GET`    | `/users`          | List users                                                  | Public              |
| `POST`   | `/users`          | Sign up; accepts profile image upload                       | Public              |
| `POST`   | `/users/sessions` | Log in                                                      | Public              |
| `GET`    | `/places`         | List all places; optional `creatorId` query filters by user | Public              |
| `GET`    | `/places/:pid`    | Get a place                                                 | Public              |
| `POST`   | `/places`         | Create a place; accepts image upload                        | Authenticated       |
| `PATCH`  | `/places/:pid`    | Update a place                                              | Authenticated owner |
| `DELETE` | `/places/:pid`    | Delete a place                                              | Authenticated owner |

Authenticated requests use the `Authorization: Bearer <token>` header. See `backend/docs/openapi.yaml` for the API schema.

## Useful scripts

Run these from the relevant app directory:

| Directory  | Command           | Description                                      |
| ---------- | ----------------- | ------------------------------------------------ |
| `backend`  | `npm start`       | Start the TypeScript API with nodemon and tsx    |
| `frontend` | `npm run dev`     | Start the Vite development server                |
| `frontend` | `npm run build`   | Type-check and build the frontend for production |
| `frontend` | `npm run lint`    | Run ESLint                                       |
| `frontend` | `npm run preview` | Preview the production build locally             |

## Repository layout

```text
backend/
  docs/openapi.yaml       OpenAPI specification
  src/
    controllers/          User and place request handlers
    middlewares/          Authentication and image-upload middleware
    models/               Mongoose user and place models
    routes/               Versioned API route definitions
    utils/                HTTP errors and address geocoding
  uploads/images/         Uploaded images
frontend/
  src/
    api/                  API endpoints and image URL helpers
    components/            Reusable UI, navigation, maps, and place/user views
    context/               Authentication context
    hooks/                 Authentication, forms, and HTTP requests
    pages/                 Auth and place screens
    types/                 Shared frontend types
```
