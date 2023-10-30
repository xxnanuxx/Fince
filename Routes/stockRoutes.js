import express from "express";
import stockController from "../Controllers/stockController.js";

const router = express.Router();

router.post("/cedears", async (req, res) => {
  res.json(await stockController.getAllCedears());
});

export default router;
