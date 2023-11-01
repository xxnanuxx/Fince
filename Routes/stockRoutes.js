import express from "express";
import stockController from "../Controllers/stockController.js";

const router = express.Router();

router.post("/cedears", async (req, res) => {
  res.json(await stockController.getCedears());
});

router.post("/acciones", async (req, res) => {
  res.json(await stockController.getStocks());
});

router.post("/titulosPublicos", async (req, res) => {
  res.json(await stockController.getGovernmentBonds());
});

router.post("/obligacionesNegociables", async (req, res) => {
  res.json(await stockController.getCorporateBonds());
});

router.post("/FCI", async (req, res) => {
  res.json(await stockController.getInvestmentFund());
});

router.get("/FCI/:simbolo", async (req, res) => {
  res.json(await stockController.getInvestmentFundData(req.params.simbolo));
});

router.get("/simbolo/:simbolo", async (req, res) => {
  res.json(await stockController.getSimbolData(req.params.simbolo));
});

router.post("/TODOS", async (req, res) => {
  let numero = parseInt(1);
  if (!numero) {
    console.log("todos putos");
  }

  res.json(await stockController.getAllInstruments());
});

export default router;
