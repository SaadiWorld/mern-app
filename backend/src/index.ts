import express from "express";
import type { Application } from "express";
import userRoutes from "./routes/user.routes";
import placeRoutes from "./routes/place.routes";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/places", placeRoutes);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});