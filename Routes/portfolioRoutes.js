import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import CustomError from "../Utils/customError.js";
import portfolioController from "../Controllers/portfolioController.js";

const router = express.Router();

router.post("/buyAsset/:userId", AuthMiddleware, async (req, res) => {
  try {
    const newAsset = {
      simbolo: req.body.simbolo,
      nombre: req.body.nombre,
      cantidad: req.body.cantidad,
      valorDeCompra: req.body.valorDeCompra,
      fechaDeCompra: req.body.fechaDeCompra,
      tipo: req.body.tipo,
      categoriaId: req.body.categoriaId,
      activoId: req.body.activoId,
    };

    const result = await portfolioController.buyAsset(
      req.params.userId,
      newAsset
    );

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in buyAsset {POST}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.get("/getPortfolio/:userId", AuthMiddleware, async (req, res) => {
  try {
    const result = await portfolioController.getPortfolio(req.params.userId);
    res.status(result.status).json({
      portfolio: result.data,
      totalInvestments: result.totalInvestments,
    });
  } catch (error) {
    console.error("Error in getPortfolio {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.get(
  "/getAssetById/:userId/:assetId",
  AuthMiddleware,
  async (req, res) => {
    try {
      const result = await portfolioController.getAssetById(
        req.params.userId,
        req.params.assetId
      );
      res.status(result.status).json({
        asset: result.data,
      });
    } catch (error) {
      console.error("Error in getAssetById {GET}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

router.put("/sellAsset/:userId", AuthMiddleware, async (req, res) => {
  try {
    const assetId = req.body.activoId;
    const quantity = req.body.cantidad;
    const salePrice = req.body.precioDeVenta;
    const userId = req.params.userId;
    const result = await portfolioController.sellAsset(
      userId,
      assetId,
      quantity,
      salePrice
    );

    res.status(result.status).json(result.message);
  } catch (error) {
    console.error("Error in getTransactions {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export default router;
