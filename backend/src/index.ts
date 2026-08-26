import express from "express";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import type { Application, ErrorRequestHandler } from "express";
import userRoutes from "./routes/user.routes";
import placeRoutes from "./routes/place.routes";
import HttpError from "./utils/http-error";

loadEnvFile();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const correlationId = req.header("x-correlation-id") ?? randomUUID();
  res.setHeader("x-correlation-id", correlationId);
  next();
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/places", placeRoutes);

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

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    app.listen(5001, () => {
    console.log("Server is running on port 5001");
  });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });