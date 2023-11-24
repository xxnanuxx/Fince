import express from "express";
import stockController from "../Controllers/stockController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
/**
 * @openapi
 * /cedears:
 *   post:
 *     summary: Obtener información sobre Cedears.
 *     description: Este endpoint devuelve información sobre Cedears.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de Cedears.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "cedears": [ ... ]  # Lista de Cedears
 *               }
 */
router.post("/cedears", authMiddleware, async (req, res) => {
  res.json(await stockController.getCedears());
});
/**
 * @swagger
 * /acciones:
 *   post:
 *     summary: Obtener información sobre acciones.
 *     description: Este endpoint devuelve información sobre acciones.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de acciones.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "acciones": [ ... ]  # Lista de acciones
 *               }
 */
router.post("/acciones", authMiddleware, async (req, res) => {
  res.json(await stockController.getStocks());
});
/**
 * @swagger
 * /titulosPublicos:
 *   post:
 *     summary: Obtener información sobre títulos públicos.
 *     description: Este endpoint devuelve información sobre títulos públicos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de títulos públicos.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "titulosPublicos": [ ... ] # Lista de títulos públicos
 *               }
 */
router.post("/titulosPublicos", authMiddleware, async (req, res) => {
  res.json(await stockController.getGovernmentBonds());
});
/**
 * @swagger
 * /obligacionesNegociables:
 *   post:
 *     summary: Obtener información sobre obligaciones negociables.
 *     description: Este endpoint devuelve información sobre obligaciones negociables.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de obligaciones negociables.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "obligacionesNegociables": [ ... ]  # Lista de obligaciones negociables
 *               }
 */
router.post("/obligacionesNegociables", authMiddleware, async (req, res) => {
  res.json(await stockController.getCorporateBonds());
});
/**
 * @swagger
 * /FCI:
 *   post:
 *     summary: Obtener información sobre Fondos Comunes de Inversión (FCI).
 *     description: Este endpoint devuelve información sobre Fondos Comunes de Inversión (FCI).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de Fondos Comunes de Inversión.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "FCI": [ ... ]  # Lista de Fondos Comunes de Inversión
 *               }
 */
router.post("/FCI", authMiddleware, async (req, res) => {
  res.json(await stockController.getInvestmentFund());
});
/**
 * @swagger
 * /FCI/{simbolo}:
 *   get:
 *     summary: Obtener datos específicos de un FCI.
 *     description: Este endpoint devuelve datos específicos de un FCI basado en su símbolo.
 *     parameters:
 *       - in: path
 *         name: simbolo
 *         required: true
 *         description: Símbolo único del FCI.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve los datos del FCI.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "datosFCI": { ... } # Datos específicos del FCI
 *               }
 *       404:
 *         description: No encontrado. El FCI con el símbolo proporcionado no existe.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "FCI no encontrado."
 *               }
 */
router.get("/FCI/:simbolo", authMiddleware, async (req, res) => {
  res.json(await stockController.getInvestmentFundData(req.params.simbolo));
});
/**
 * @swagger
 * /simbolo/{simbolo}:
 *   get:
 *     summary: Obtener datos específicos de un símbolo.
 *     description: Este endpoint devuelve datos específicos de un símbolo basado en su identificador único.
 *     parameters:
 *       - in: path
 *         name: simbolo
 *         required: true
 *         description: Identificador único del símbolo.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve los datos del símbolo.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "datosSimbolo": { ... }  #Datos específicos del símbolo
 *               }
 *       404:
 *         description: No encontrado. El símbolo con el identificador proporcionado no existe.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "error": "Símbolo no encontrado."
 *               }
 */
router.get("/simbolo/:simbolo", authMiddleware, async (req, res) => {
  res.json(await stockController.getSimbolData(req.params.simbolo));
});
/**
 * @swagger
 * /TODOS:
 *   post:
 *     summary: Obtener información sobre todos los instrumentos.
 *     description: Este endpoint devuelve información sobre todos los instrumentos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Éxito. Devuelve la información de todos los instrumentos.
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "instrumentos": [ ... ]  #Lista de todos los instrumentos
 *               }
 */
router.post("/TODOS", authMiddleware, async (req, res) => {
  res.json(await stockController.getAllInstruments());
});

export default router;
