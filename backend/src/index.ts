import express from "express";
import type { Application } from "express";

const app: Application = express();
app.use(express.json());

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});