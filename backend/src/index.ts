import express from "express";
import { loadEnvFile } from "node:process";
import type { Application, ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.routes";
import placeRoutes from "./routes/place.routes";
import HttpError from "./utils/http-error";

loadEnvFile();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);

// runs only when no previous route handled the request
// It creates a 404 error for unknown routes
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
};

app.use(errorHandler);


app.listen(5001, () => {
  console.log("Server is running on port 5001");
});