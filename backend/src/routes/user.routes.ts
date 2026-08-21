import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Get users" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

export default router;