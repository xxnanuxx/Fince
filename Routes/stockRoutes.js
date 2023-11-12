import express from "express";
import stockController from "../Controllers/stockController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cedears", authMiddleware, async (req, res) => {
  res.json(await stockController.getCedears());
});

router.post("/acciones", authMiddleware, async (req, res) => {
  res.json(await stockController.getStocks());
});

router.post("/titulosPublicos", authMiddleware, async (req, res) => {
  res.json(await stockController.getGovernmentBonds());
});

router.post("/obligacionesNegociables", authMiddleware, async (req, res) => {
  res.json(await stockController.getCorporateBonds());
});

router.post("/FCI", authMiddleware, async (req, res) => {
  res.json(await stockController.getInvestmentFund());
});

router.get("/FCI/:simbolo", authMiddleware, async (req, res) => {
  res.json(await stockController.getInvestmentFundData(req.params.simbolo));
});

router.get("/simbolo/:simbolo", authMiddleware, async (req, res) => {
  res.json(await stockController.getSimbolData(req.params.simbolo));
});

router.post("/TODOS", authMiddleware, async (req, res) => {
  res.json(await stockController.getAllInstruments());
});

export default router;
