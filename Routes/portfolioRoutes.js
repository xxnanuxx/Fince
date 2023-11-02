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
      tipo: req.body.tipo,
      valorDeCompra: req.body.valorDeCompra,
      fechaDeCompra: req.body.fechaDeCompra,
      categoriaId: req.body.categoriaId,
    };

    const result = await portfolioController.buyAsset(
      req.params.userId,
      newAsset
    );

    res.status(result.status).json(result.data);
  } catch (error) {
    console.log("Error in buyAsset {POST}: " + error.message);
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
      porfolio: result.data,
      totalInvestments: result.totalInvestments,
    });
  } catch (error) {
    console.log("Error in getPortfolio {GET}: " + error.message);
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
      console.log("Error in getAssetById {GET}: " + error.message);
      if (error instanceof CustomError) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  }
);

router.delete("/sellAsset", AuthMiddleware, async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in getTransactions {GET}: " + error.message);
    if (error instanceof CustomError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export default router;
