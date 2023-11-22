import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import CustomError from "../Utils/customError.js";
import portfolioController from "../Controllers/portfolioController.js";

const router = express.Router();
/**
 * @swagger
 * /buyAsset/{userId}:
 *   post:
 *     summary: Comprar un activo para el portafolio de un usuario.
 *     description: Este endpoint permite a un usuario comprar un activo y agregarlo a su portafolio.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario que está realizando la compra.
 *         schema:
 *           type: string
 *       - in: body
 *         name: newAsset
 *         description: Datos del nuevo activo a comprar.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             simbolo:
 *               type: string
 *             nombre:
 *               type: string
 *             cantidad:
 *               type: integer
 *             valorDeCompra:
 *               type: number
 *             fechaDeCompra:
 *               type: string
 *               format: date
 *             tipo:
 *               type: string
 *             categoriaId:
 *               type: string
 *             activoId:
 *               type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. El activo ha sido comprado y agregado al portafolio.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Activo comprado exitosamente."
 *               }
 *       400:
 *         description: Error de solicitud. Puede deberse a datos de activo no válidos.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Datos de activo no válidos."
 *               }
 *       500:
 *         description: Error interno del servidor. Puede deberse a un problema en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Error interno del servidor."
 *               }
 */
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
/**
 * @swagger
 * /getPortfolio/{userId}:
 *   get:
 *     summary: Obtener el portafolio de un usuario.
 *     description: Este endpoint devuelve el portafolio de inversiones de un usuario.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario para el cual se solicita el portafolio.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve el portafolio del usuario.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "portfolio": [ ... ], // Lista de activos en el portafolio
 *                 "totalInvestments": 10000 // Total de inversiones en el portafolio
 *               }
 *       404:
 *         description: No encontrado. El portafolio del usuario no existe.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Portafolio no encontrado."
 *               }
 *       500:
 *         description: Error interno del servidor. Puede deberse a un problema en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Error interno del servidor."
 *               }
 */
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
/**
 * @swagger
 * /getAssetById/{userId}/{assetId}:
 *   get:
 *     summary: Obtener información específica de un activo en el portafolio.
 *     description: Este endpoint devuelve información específica de un activo en el portafolio de un usuario.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario dueño del portafolio.
 *         schema:
 *           type: string
 *       - in: path
 *         name: assetId
 *         required: true
 *         description: ID del activo en el portafolio.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información del activo.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "asset": { ... } // Información específica del activo
 *               }
 *       404:
 *         description: No encontrado. El activo con el ID proporcionado no existe en el portafolio.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Activo no encontrado en el portafolio."
 *               }
 *       500:
 *         description: Error interno del servidor. Puede deberse a un problema en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Error interno del servidor."
 *               }
 */
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
/**
 * @swagger
 * /sellAsset/{userId}:
 *   put:
 *     summary: Vender un activo del portafolio de un usuario.
 *     description: Este endpoint permite a un usuario vender un activo de su portafolio.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario que está realizando la venta.
 *         schema:
 *           type: string
 *       - in: body
 *         name: sellDetails
 *         description: Detalles de la venta del activo.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             activoId:
 *               type: string
 *             cantidad:
 *               type: integer
 *             precioDeVenta:
 *               type: number
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. El activo ha sido vendido y retirado del portafolio.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Activo vendido exitosamente."
 *               }
 *       400:
 *         description: Error de solicitud. Puede deberse a datos de venta no válidos.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Datos de venta no válidos."
 *               }
 *       500:
 *         description: Error interno del servidor. Puede deberse a un problema en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Error interno del servidor."
 *               }
 */
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
